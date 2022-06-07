import * as express from "express";
import * as user from '../models/user'
import { Role } from "../models/user";
import { Router } from "express";
import { AsyncLocalStorage } from "async_hooks";
import jsonwebtoken = require('jsonwebtoken');
import passport = require("passport");
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


// Returns a list of all users' public data: id, username, stats, playing
router.get('/', async (req, res) => {
    const projection = {
        username: true,
        stats: true,
        playing:true,
    }
    await user.getModel().find({}, projection).then(function (data) {
        res.send(data);
    })

})

// Returns the public data of the user identified by {:userId} if it exists, else throws error 404 
router.get('/:userid', async (req, res)=>{
    const projection = {
        username: true,
        stats: true,
        playing: true
    }
    await user.getModel().find({_id: req.params.userid}, projection).then(function(data){
        if(data.length === 0) res.status(404).json({error:true, errormessage:"There is no user with such userId" })
        else res.send(data)
    })
})

// Deletes the user identified by {:userId} 
// A moderator can delete all users 
// A regular user can use this endpoint only with his own {:userId}
router.delete('/:userId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ",""), process.env.JWT_SECRET)

    if(jwt['_id'] === req.params.userId || jwt['role'] === Role.Mod ){
        await user.getModel().deleteOne({_id:req.params.userId}).then(function(data){
            res.send(data)
        });
    }
    res.send({error: "You don't have the authorization to execute this endpoint"}).status(404)
})

export = router;

