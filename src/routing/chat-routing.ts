import { Router } from "express";
import { Types } from "mongoose";
import { ChatInterface, ChatModel, createChat } from "../models/chat";
import { getUser, getUserById, User } from "../models/user";
import jsonwebtoken = require('jsonwebtoken');
import ChatMessageEmitter from "../socket-helper/Emitter/ChatMessageEmitter";
import ios from "..";
import { parseJwt } from "./user-routes";
import { text } from "body-parser";
import { RoomEmitter } from "../socket-helper/Emitter/RoomEmitter";
import { Emitter } from "../socket-helper/Emitter/Emitter";

export const router = Router();

router.get('', async (req, res) => {
    let jwt = parseJwt(req.headers.authorization);
    let userId = req.body.userId;
    if (userId && jwt['_id'] == userId) {

        await User.findById(userId)
            .then((data) => {
                return res.status(200).json(data.chats);
            })
            .catch((e) => {
                return res.status(500).json({ error: e, timestamp: Date.now() })
            })
    }
    return res.status(201).json({ error: "Authenticate pls" });
})


/*  Creates a chat between two users and store chatId into both models.
*   Returns the chatInterface or 404/500 if an error occurs.
*/

router.post('', async (req, res) => {

    let jwt = jsonwebtoken.decode(req.headers.authorization.replace("Bearer ", ""));
    let userId = req.body.userId;
    let friendId = req.body.friendId;
    let txt = req.body.txt;
   
    if (userId && friendId && jwt['_id'] == userId) {
        try {
            var users = [new Types.ObjectId(userId), new Types.ObjectId(friendId)];
            var chat: ChatInterface = await createChat(users, txt);

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
            }).catch(err => {
                throw err;
            });
            

        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }

        return res.status(200).json({ error: false, message: 'Chat created', timestamp: Date.now(), chatId: chat._id, chat });
    }
    return res.status(401).json({error: false, errormessage: 'Unauthorized', timestamp: Date.now()});
})

router.delete('', async(req, res) => {
    let jwt = jsonwebtoken.decode(req.headers.authorization.replace("Bearer ", ""));
    let userId = req.body.userId;
    let friendId = req.body.friendId;
    if (userId && friendId && jwt['_id'] == userId) {
        
    }
})

/*  Retrieves the chat referred by the chatId.
*   Returns the chatInterface or 404/500 if an error occurs.
*/
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

/*  Adds a message in the chatInterface.
*   Returns the chatInterface or 404/500 if an error occurs.
*   Sends a message
*/
router.post('/:chatId/messages', async (req, res) => {
    let jwt = jsonwebtoken.decode(req.headers.authorization.replace("Bearer ", ""));
    const { sender, text } = req.body;
    if(sender === jwt['_id']){
        try {
            const chatId = req.params.chatId;
    
            const message = await ChatModel.findById(chatId).then(async data => {
                return await data.addMessage(new Types.ObjectId(sender), text);
            }
    
            ).catch(err => { throw err });
    
            const messageEmitter = new ChatMessageEmitter(ios, chatId);
            messageEmitter.emit({message, chatId});
    
            return res.status(200).json({ error: false, timestamp: Date.now(), message });
    
    
        } catch (err) {
            if (err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
    }

    return res.status(401).json({error: false, errormessage: 'Unauthorized', timestamp: Date.now()});
})