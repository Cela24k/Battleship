import { Router } from "express";
import { Types } from "mongoose";
import { ChatInterface, ChatModel, createChat } from "../models/chat";
import { User } from "../models/user";
import jsonwebtoken = require('jsonwebtoken');
import { ChatMessageListener } from "../socket-helper/Listener/ChatMessageListener";
import ChatEmitter from "../socket-helper/Emitter/ChatEmitter";
import ios from "..";


export const router = Router();

/*  Creates a chat between two users and store chatId into both models.
*   Returns the chatInterface or 404/500 if an error occurs.
*/
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
/*  Retrieves the chat referred by the chatId.
*   Returns the chatInterface or 404/500 if an error occurs.
*/
router.get('/:chatId', async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const chat = await ChatModel.findById(chatId).catch(err => { throw err; });
        return res.status(200).json({ error: false, timestamp: Date.now(), chat: chat });// should we either return the entire chat, or split the chat into multiple attributes? Such as charId: chat._id, chatUsers: chat.users...

    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})
/*  Adds a message in the chatInterface.
*   Returns the chatInterface or 404/500 if an error occurs.
*/
router.post('/:chatId/send', async (req, res) => {//TODO socket integration
    try {
        const chatId = req.params.chatId;
        const {sender, text} = req.body;
        const chat = await ChatModel.findById(chatId).then(async data => {
            return await data.addMessage(new Types.ObjectId(sender), text);
            
        }
        
        ).catch(err => { throw err });
        
        const messageEmitter = new ChatEmitter(ios, chatId);
        messageEmitter.emit(chat);
        console.log("Socket inviato");//TODO frontend test, or in postman.
        
        return res.status(200).json({ error: false, timestamp: Date.now(), chat: chat });
        

    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})
//TODO think about a delete, is it useful to delete a private chat? moreover a game chat might be deleted when the game ends.