const result = require('dotenv').config(); 
import fs = require('fs');
import http = require('http');
//vedere se bisogna fare da qua https
import colors = require('colors');
colors.enabled = true;
import mongoose = require('mongoose');
import express = require('express');
import bodyparser = require('body-parser');
import { expressjwt, Request as JWTrequest } from "express-jwt";
import cors = require('cors');
import { Server } from "socket.io";
import { router as authRoutes } from './routing/auth-routes';
import { router as userRoutes } from './routing/user-routes';
import { router as chatRoutes } from './routing/chat-routing';
import { router as matchMakingRoutes } from './routing/matchmaking-routes';
import { router as matchRoutes } from './routing/match-routes';
import { MatchMakingEngine } from './routing/matchmaking-engine/engine';
import { UserJoinListener } from './socket-helper/Listener/UserJoinListener';
import { JoinChatListener } from './socket-helper/Listener/JoinChatListener';
import { MatchJoinedListener } from './socket-helper/Listener/MatchJoinListener';
import ChatMatchEmitter from './socket-helper/Emitter/ChatMatchEmitter';
import { MatchChatListener } from './socket-helper/Listener/MatchChatListener';
import { MatchLeftListener } from './socket-helper/Listener/MatchLeftListener';
import { setUserState, UserState } from './models/user';
import { LogOutListener } from './socket-helper/Listener/LogOutListener';
import { FriendMatchListener } from './socket-helper/Listener/FriendMatchListener';
import { FriendMatchResponseListener } from './socket-helper/Listener/FriendMatchResponseListener';

const app = express();
var auth = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });

app.use(cors());

app.use(bodyparser.json())

app.use((req, res, next) => {
    console.log("------------------------------------------------".rainbow)
    console.log("Method: " + req.method.cyan + " Endpoint : " + req.url.red + " IP" + req.ip);
    res.on('finish', () => { console.log("Response Status : " + res.statusCode); });
    next();
})

app.get("/", (req, res) => {
    res.status(200).json({ api_version: "1.0", endpoints: ["/auth", "/user"] });
});

app.use('/auth', authRoutes);
app.use('/user', auth, userRoutes);
app.use('/chat', auth, chatRoutes);
app.use('/match', auth, matchRoutes);
app.use('/matchmaking', auth, matchMakingRoutes);


var server = http.createServer(app);
export const ios = new Server(server, {
    cors: {
        origin: "*"
    }
}); 

mongoose.connect(process.env.DB_URI)
    .then(
        () => {
            console.log('Connected to DB'.green);
            server.listen(8080, () => console.log("HTTP Server started at http://localhost:8080".green));
        }
    ).catch(
        (err) => {
            console.log("Error Occurred during initialization".red);
            console.log(err);
        }
    )
ios.on('connection', (client) => {
    console.log("------------------------------------------------".america)
    console.log("Socket.io client ID: ".green + client.id.red + " connected".green);
    const userJoin = new UserJoinListener(client);
    userJoin.listen();

    const joinChat = new JoinChatListener(client);
    joinChat.listen();

    const matchJoin = new MatchJoinedListener(ios, client);
    matchJoin.listen();

    const matchChat = new MatchChatListener(client);
    matchChat.listen();

    const matchLeft = new MatchLeftListener(ios,client);
    matchLeft.listen();

    const logOut = new LogOutListener(client);
    logOut.listen();

    const friendMatch = new FriendMatchListener(client);
    friendMatch.listen();

    const friendMatchResponse = new FriendMatchResponseListener(client);
    friendMatchResponse.listen();

    console.log('Auth ', client.handshake.auth);
    client.join(client.handshake.auth['userid']);

    client.on('disconnect', async () => {
        try{console.log("------------------------------------------------".america);
        console.log("Socket.io client ID: ".green + client.id.red + " has been disconnected".yellow);
        if(client.handshake.auth.userId)
            await setUserState(client.handshake.auth.userId, UserState.Offline);}
        catch(err){
            console.log(err);
        }
    })
    client.on('notification', (data) => {
        console.log('Il server socket ha captato: ', data);
    })
})



const matchmakingEngine = new MatchMakingEngine(ios, 5000);
matchmakingEngine.start();

export default ios;
