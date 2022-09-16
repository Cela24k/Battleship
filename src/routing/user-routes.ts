import * as user from '../models/user'
import { Role } from "../models/user";
import { Router } from "express";
import jsonwebtoken = require('jsonwebtoken');
import { Types } from "mongoose";
import * as notifications from "../models/notification";
import ios from "..";
import { ChatModel, createChat } from "../models/chat";
import { getUser, getUserById, User } from "../models/user";
import NotificationEmitter from '../socket-helper/Emitter/NotificationEmitter';


export const router = Router();

export function parseJwt(auth) {
    return auth ? jsonwebtoken.decode(auth.replace("Bearer ", "")) : null;
}


router.get('/list', (req, res) => {
    res.send(202);
})


// Returns a list of all users' public data: id, username, stats, playing
router.get('/', async (req, res) => {
    try {
        var result = await user.getAllUsers();
    }
    catch (err) {
        if (err === 'Server error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
    return res.status(200).json(result);
})

// Returns the public data of the user identified by {:userId} if it exists, else throws error 404 
router.get('/:userid', async (req, res) => {
    try {
        var result = await user.getUser(new Types.ObjectId(req.params.userid));
    }
    catch (err) {
        if (err === 'Server error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
    return res.status(200).json(result)
})

// Deletes the user identified by {:userId} 
// A moderator can delete all users 
// A regular user can use this endpoint only with his own {:userId}
router.delete('/:userId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);

    try {
        if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
            var result = await user.deleteUser(new Types.ObjectId(req.params.userId));
            return res.status(200).json(result);
        }
        else {
            return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
        }
    }
    catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})



//Returns a user's list of friends if it exists
router.get('/:userId/friends', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);

    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var result = await user.getUserFriends(new Types.ObjectId(req.params.userId));
        }
        catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
        if (result.length === 0)
            return res.status(404).json({ error: true, message: 'This user has no friends ;(', timestamp: Date.now() });
        return res.status(200).json(result);
    }
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

//Sends a friend request 
router.put('/:userId/friends/:friendId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var sender = await user.getUser(new Types.ObjectId(req.params.userId));
            await sender.friendNotification(new Types.ObjectId(req.params.friendId));
            let n = await notifications.newNotification(sender.username, sender._id, new Types.ObjectId(req.params.friendId), notifications.NotificationType.Friend)
            const notificationEmitter = new NotificationEmitter(ios, req.params.friendId);
            notificationEmitter.emit(n);

        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else if (err === 'Notification already sent')
                return res.status(409).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
        return res.status(200).json({ error: false, message: 'Friend request sent', timestamp: Date.now() });
    }
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

router.get('/:userId/notifications', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var u = await user.User.findById(new Types.ObjectId(req.params.userId));
        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
        if (u.notifications)
            return res.status(200).json(u.notifications);
        else
            return res.status(404).json({ error: true, errormessage: 'The user has no notifications', timestamp: Date.now() });
    }
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

//accept or refuse a notification (?action=accept - ?action=refuse)

router.put('/:userId/notifications/:notificationId', async (req, res) => {
    let action = req.query.action ? req.query.action : undefined;
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var u = await user.getModel().findById(new Types.ObjectId(req.params.userId));
            var notification = u.notifications.find((val) => (String(val._id) === req.params.notificationId));
            if (action == 'accept') {
                await notification.accept();
                await u.removeNotification(notification);
            }
            await u.removeNotification(notification);
        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
        return res.status(200).json({ error: false, message: 'Notification accepted', timestamp: Date.now() });
    }
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

router.post('/:userId/chat', async (req, res) => {
    
    let jwt = jsonwebtoken.decode(req.headers.authorization.replace("Bearer ", ""));
    let userId = req.params.userId;
    let friendId = req.body.friendId;
    if (jwt['_id'] == userId) {
        try {
            var users = [new Types.ObjectId(userId), new Types.ObjectId(friendId)];
            var chat = await createChat(users);
            await user.User.find({
                '_id': {
                    $in: [userId,
                        friendId]
                }
            }).then(data => {
                let promises = [];
                data.forEach(element => {
                    promises.push(element.addChat(chat));
                });
                return Promise.all(promises);
            }).catch(err => { throw err; });
        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }

        return res.status(200).json({ error: false, message: 'Chat created', timestamp: Date.now() });
    }
    return res.status(404).json({ error: true, message: 'Not allowed to create chat', timestamp: Date.now() });
})

router.get('/:userId/chats', async (req, res) => {
    let jwt = parseJwt(req.headers.authorization);
    const userId = req.params.userId;
    if (userId && jwt['_id'] == userId) {
        try {
            const u = await getUserById(new Types.ObjectId(userId));
            const chats = await u.getChats();
            const response = { chats, timestamp: Date.now() };
            return res.status(200).json(response);
        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
    }
    return res.status(401).json({ error: false, errormessage: "Unauthorized", timestamp: Date.now() })

})

