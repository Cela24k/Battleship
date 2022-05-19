import * as express from "express";
import { Router } from 'express';
import { request } from "http";
import * as user from '../models/user'

var router = Router();

router.post('/login', function (req, res) {

})
router.post('/registration', function (req, res, next) {//TODO non funziona postmassage, vedere come mandare il body giusto
    const { email, password, username } = req.body;
    console.log(req.body);
    if (email) {// TODO controllo email non solo da parte frontend ma anche da backend
        user.getModel().findOne({ email: email }) //vedere in che modo mettere all'interno della richiesta, il nome email cosi da non dover ripetere con lo stesso nome del database
            .then((doc) => {
                if (!doc) {
                    var u = user.newUser({
                        username: username,
                        email: email
                    })
                    u.setPassword(password);
                    u.save().then((data) => {
                        return res.status(200);
                    }).catch((reason) => {
                        return res.status(404);
                    })

                }
            }).catch((err) => {
                return res.status(404).send("Geshborso")
            })
    }
    return res.status(404);
})



export = router;