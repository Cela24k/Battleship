import * as express from "express";
import { Router } from 'express';
import { request } from "http";
import * as user from '../models/user'
import passport = require('passport');           // authentication middleware for Express
import passportHTTP = require('passport-http');  // implements Basic and Digest authentication for HTTP (used for /login endpoint)

var router = Router();

passport.use( new passportHTTP.BasicStrategy(
    function(email: string, password: string, done:any) {
  
      // "done" callback (verify callback) documentation:  http://www.passportjs.org/docs/configure/
  
      // Delegate function we provide to passport middleware
      // to verify user credentials 
  
      console.log("New login attempt from ".green + email );
      user.getModel().findOne( {email: email} , (err, user)=>{
        if( err ) {
          return done( {statusCode: 500, error: true, errormessage:err} );
        }
  
        if( !user ) {
          return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid user!"});
        }
  
        if( user.validatePassword( password ) ) {
          return done(null, user);
        }
  
        return done(null,false,{statusCode: 500, error: true, errormessage:"Invalid password!"});
      })
    }
  ));

router.post('/login',passport.authenticate('basic', { session: false }), function (req, res) {
    
})
/**
 * It registers a user
 */
router.post('/register', async function (req, res, next) {
    const { username, email, password } = req.body;

    // TODO controllo email non solo da parte frontend ma anche da backend
    let userDoc = await user.getModel().findOne({ email: email, username: username })

    if (!userDoc) {
        let u = user.newUser({
            username,
            email
        })
        u.setPassword(password);
        await u.save().then((data) => {
            return res.status(200).json({ error: false, errormessage: "", id: data._id });
        }).catch(() => {
            return res.status(400).json({ error: true, errormessage: "Something has been wrong with registration!" });
        })

    } else {
        return res.status(400).json({ error: true, errormessage: "User already exist" });;
    }


})



export = router;