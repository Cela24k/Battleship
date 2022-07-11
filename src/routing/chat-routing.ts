import { Router } from "express";
import { Types } from "mongoose";
import { createChat } from "../models/chat";
import { User } from "../models/user";
import jsonwebtoken = require('jsonwebtoken');


export const router = Router();

router.post('/newchat', async (req, res) => {
    //TODO try to find out if newchat should include a 
    //message on his req.body. Shall the request be called when user create a chat, or when he send  his first message?
    // see if is good pract send friend id in the url.
    let jwt = jsonwebtoken.decode(req.headers.authorization.replace("Bearer ", ""));
    let userId = req.body.userId;
    let friendId = req.body.friendId;
    if (userId && friendId && jwt['_id'] == userId) {
        try {
            var users = [new Types.ObjectId(userId), new Types.ObjectId(friendId)];
            var chat = createChat(users);
            await User.find({
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