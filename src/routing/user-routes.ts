import * as express from "express";
import * as user from '../models/user'
import { Role } from "../models/user";
import { Router } from "express";
import { AsyncLocalStorage } from "async_hooks";
import jsonwebtoken = require('jsonwebtoken');
import passport = require("passport");
import { Types } from "mongoose";
var router = Router();

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

    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod){
        try {
            var result = user.getUserFriends(new Types.ObjectId(req.params.userId));
        } 
        catch (err) {
            if(err === 'Server Error')
                return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
            else
                return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
        }
        if((await result).length === 0)
            return res.status(200).json({ error: false, errormessage: 'This user has no friends ;(', timestamp: Date.now() });
        return res.status(200).json(result);
    }
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})
//Inserts a user into the user's friendlist

//FORSE non fare ma fare endpoint per mandare una richiesta di amicizia
router.put('/users/:userId/friends/:friendId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    if (jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod){
        try {
            //var result = user.makeFriendship(req.params.id);
        } catch (err) {
            
        }
    }
    res.send({error: "You don't have the authorization to execute this endpoint"}).status(404)
    return res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() });
})

export = router;
