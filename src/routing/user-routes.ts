import * as user from '../models/user'
import { Role } from "../models/user";
import { Router } from "express";
import jsonwebtoken = require('jsonwebtoken');
import { Types } from "mongoose";
import * as notifications from "../models/notification";
import ios from "..";
import { ChatModel, createChat } from "../models/chat";
import { getUser, getUserById, User } from "../models/user";


export const router = Router();

export function parseJwt(auth){
    return auth ? jsonwebtoken.decode(auth.replace("Bearer ", "")) : null;
}
/*
    ENDPOINTS	        ATTRIBUTES	    METHOD	    DESCRIPTION
    /users		                        GET	        Returns a list of all users if the client is a moderator
        	
    /users		                        POST	    Create a new user if the client is a moderator 
                                                    (Maybe replaced by /register or just use this endpoint in the register section)

    /users	            ?name=	        GET	        Returns the userS containing the specified name
    /users/:userId		                GET	        Returns the user specified by its id, if it exists
    /users/:userId		                DELETE	    Deletes the specified user if it exists
    /users/:userId		                PATCH	    Edit a user with the body of the request
    
 **/

router.get('/list', (req, res) => {
    console.log("GIUSTO ED AUTENTICATO");//Debugging tool for auth
    res.send(202);
})


// DONE
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

// DONE
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

    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var result = await user.deleteUser(new Types.ObjectId(req.params.userId));
        }
        catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
        return res.status(200).json(result);
    }
    else
        return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

//vedere se farlo
router.patch('/:userId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);

    if (jwt['role'] === Role.Mod) {
        await user.getModel().findOneAndUpdate({ _id: req.params.userId }, {})
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
            return res.status(200).json({ error: false, message: 'This user has no friends ;(', timestamp: Date.now() });
        return res.status(200).json(result);
    }
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

//Sends a friend request 
// TODO use websocket
router.put('/:userId/friends/:friendId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var sender = await user.getUser(new Types.ObjectId(req.params.userId));
            await sender.friendNotification(new Types.ObjectId(req.params.friendId));

            //fare una classe
            // ios.in(req.params.friendId).emit('notification', notifications.newNotification(
            // sender.username,
            // sender._id,
            // new Types.ObjectId(req.params.friendId), notifications.NotificationType.Friend 
            // ));
            let n = await notifications.newNotification(sender.username, sender._id, new Types.ObjectId(req.params.friendId), notifications.NotificationType.Friend)
            ios.in(req.params.friendId).emit('notification', n);

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
//TODO use websocket 
router.put('/:userId/notifications/:notificationId', async (req, res) => {
    let action = req.query.action ? req.query.action : undefined;
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod) {
        try {
            var u = await user.getModel().findById(new Types.ObjectId(req.params.userId));
            var notification = u.notifications.find((val) => (String(val._id) === req.params.notificationId));
            if (action == 'accept')
                await notification.accept();
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
    //TODO try to find out if newchat should include a 
    //message on his req.body. Shall the request be called when user create a chat, or when he send  his first message?
    // see if is good pract send friend id in the url.
    let jwt = jsonwebtoken.decode(req.headers.authorization.replace("Bearer ", ""));
    let userId = req.params.userId;
    let friendId = req.body.friendId;
    if (jwt['_id'] == userId) {
        try {
            var users = [new Types.ObjectId(userId), new Types.ObjectId(friendId)];
            var chat = createChat(users);
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
    if(userId && jwt['_id'] == userId){
        try {
            const u = await getUserById(new Types.ObjectId(userId));
            const chats = await u.getChats();
            console.log(chats);
            const response = {chats, timestamp:Date.now()};
            console.log(response);
            return res.status(200).json(response);
        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
    }
    return res.status(401).json({error: false, errormessage:"Unauthorized", timestamp:Date.now()})
    
})

