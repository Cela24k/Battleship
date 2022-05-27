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

router.get('/', async (req, res) => {

    var projection = {
        username: true,
        stats: true,
        playing:true,
    }

    await user.getModel().find({}, projection).then(function (data) {
        res.send(data);
    })

})

router.get('/:userId', async (req, res) => {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ",""), process.env.JWT_SECRET)

    var projection = {
        username: true,
        stats: true,
        playing: true,
    }

    console.log(req.headers.authorization);
    console.log(jwt);
    console.log(typeof jwt);

    res.send();
})

export = router;

