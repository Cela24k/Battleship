import * as express from "express";
import { Router } from 'express';
import { request } from "http";
import * as user from '../models/user'

var router = Router();

router.post('/login', function (req, res) {

})
router.post('/register',async function (req, res, next) {//TODO non funziona postmassage, vedere come mandare il body giusto
    const { email, password, username } = req.body;
    // TODO controllo email non solo da parte frontend ma anche da backend
    let userDoc =  await user.getModel().findOne({ email: email, username : username }) //vedere in che modo mettere all'interno della richiesta, il nome email cosi da non dover ripetere con lo stesso nome del database

    if (!userDoc) {
        let u = user.newUser({
            username,
            email
        })
        u.setPassword(password);
        await u.save().then(() => {
            return res.status(200).send("User Registred!");
        }).catch(() => {
            return res.status(400).send("Something has been wrong with registration!");
        })

    }else{
        return res.status(400).send("User already exists!");
    }


})



export = router;