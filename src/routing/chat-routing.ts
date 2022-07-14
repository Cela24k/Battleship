import { Router } from "express";
import { Types } from "mongoose";
import { ChatInterface, ChatModel, createChat } from "../models/chat";
import { User } from "../models/user";
import jsonwebtoken = require('jsonwebtoken');


export const router = Router();

// Create a new chat for 2 players, response with chatId 
router.post('/newchat', async (req, res) => {
    //TODO try to find out if newchat should include a 
    //message on his req.body. Shall the request be called when user create a chat, or when he send  his first message?
    //Test if a user deletes the chat, should the chat being destroyed also for his friend?
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
            await chat.save();

        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }

        return res.status(200).json({ error: false, message: 'Chat created', timestamp: Date.now(), chatId: chat._id });
    }
    return res.status(404).json({ error: true, message: 'Not allowed to create chat', timestamp: Date.now() });
})

router.get('/:chatId', async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const chat = await ChatModel.findById(chatId).catch(err => { throw err; });
        return res.status(200).json({ error: false, timestamp: Date.now(), chat: chat });

    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})

router.post('/:chatId/send', async (req, res) => {//TODO sending message throw a casting error for the text argument line 69.
    try {
        const chatId = req.params.chatId;
        const {sender, text} = req.body;
        const chat = await ChatModel.findById(chatId).then(async data => {
            return await data.addMessage(new Types.ObjectId(sender), text);
            
        }).catch(err => { throw err });
        //socket messageemitter call here.
        return res.status(200).json({ error: false, timestamp: Date.now(), chat: chat });

    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})