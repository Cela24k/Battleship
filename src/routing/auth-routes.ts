import * as express from "express";
import { Router } from 'express';
import { request } from "http";
import * as user from '../models/user'

var router = Router();

router.post('/login', function (req, res) {

})
router.post('/register',async function (req, res, next) {//TODO non funziona postmassage, vedere come mandare il body giusto
    const { username, email, password } = req.body;
    console.log(req.body);
    console.log('Entering in auth-routes and executing post /register');
    console.log('username: '+ username,'email: '+ email,'password: '+ password );    
    
    // TODO controllo email non solo da parte frontend ma anche da backend
    let userDoc =  await user.getModel().findOne({ email: email, username : username }) //vedere in che modo mettere all'interno della richiesta, il nome email cosi da non dover ripetere con lo stesso nome del database

    if (!userDoc) {
        let u = user.newUser({
            username,
            email
        })
        u.setPassword(password);
        await u.save().then((data) => {
            return res.status(200).json({ error: false, errormessage: "", id: data._id });
        }).catch(() => {
            return res.status(400).json({ error: true, errormessage: "Something has been wrong with registration!"});
        })

    }else{
        return res.status(400).json({ error: true, errormessage: "User already exist"});;
    }


})



export = router;