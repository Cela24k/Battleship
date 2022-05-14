import * as express from "express";
import {Router} from 'express';
import { request } from "http";
import * as user from '../models/user'

var router = Router();

router.post('/login', function(req, res){
    
})
router.post('/registration', function(req, res){
    const {email} = req.body;
    if(email){
        user.getModel().findOne({email : email}) //vedere in che modo mettere all'interno della richiesta, il nome email cosi da non dover ripetere con lo stesso nome del database
        .then((doc) => {
            if(!doc){
                //create a new User con email e password
            }
        })
    }
})



export = router;