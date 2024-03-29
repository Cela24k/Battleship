import * as express from "express";
import { Router } from 'express';
import { request } from "http";
import * as user from '../models/user'
import passport = require('passport');          
import passportHTTP = require('passport-http');
import jsonwebtoken = require('jsonwebtoken');
import { parseJwt } from "./user-routes";
import { getUserById, Role } from "../models/user";
import { Types } from "mongoose";

export const router = Router();

passport.use(new passportHTTP.BasicStrategy(
  function (username: string, password: string, done: any) {

   

    console.log("New login attempt from ".green + username.red);
    user.getModel().findOne({ username: username }, (err, user: user.UserInterface) => {
      if (err) {
        return done({ statusCode: 500, error: true, errormessage: err });
      }

      if (!user) {
        return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid user!" });
      }

      if (user.validatePassword(password)) {
        return done(null, user);
      }

      return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid password!" });
    })
  }
));

router.get('/login', passport.authenticate('basic', { session: false }), function (req: any, res) {
  try {
    let { username, email, role, _id } = req.user;
    let tokendata = {
      username,
      role,
      email,
      _id
    }
    let token = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ error: false, errormessage: "", token });
  }
  catch (e) {
    return res.status(400).json({ error: true, errormessage: e });
  }
})
/**
 * It registers a user
 */
router.post('/register', async function (req, res, next) {

  const { username, email, password } = req.body;
  let data = {}
  let jwt = parseJwt(req.headers.authorization);
  let role = Role.None;

  let userDoc = await user.getModel().findOne({ username: username })

  if (!userDoc) {
    if (email === '' && jwt['role'] === Role.Mod) {
      role = Role.Mod;
      data = { username, password, role };
    }
    else
      data = { username, email, password };

    let u = user.newUser(data);
    console.log(u);
    u.setPassword(password);
    await u.save().then((data) => {
      return res.status(200).json({ error: false, errormessage: "", id: data._id });
    }).catch((err) => {
      return res.status(400).json({ error: true, errormessage: err });
    })

  } else {
    return res.status(400).json({ error: true, errormessage: "User already exist" });;
  }

})


router.patch('/:userId', async (req, res) => {
  try {
    let jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
    const { username, email, password } = req.body;
    const userId = req.params.userId;
    if (jwt['role'] === Role.Mod && jwt['email'].length == 0) {
      const user = await getUserById(new Types.ObjectId(userId));
      user.setPassword(password);
      await user.changeModInfo(username, email);
      return res.status(200).json({ err: false });
    }
  } catch (err) {
    return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
  }
})


