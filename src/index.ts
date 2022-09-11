// importati  imoduli che ci possono servire per l'applicazione
const result = require('dotenv').config(); //loada variabili d'ambiente into process.env:The process.env property returns an object containing the user environment. https://nodejs.org/docs/latest/api/process.html#process_process_env
import fs = require('fs');
import http = require('http');
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
import { ChatMessageListener } from './socket-helper/Listener/ChatMessageListener';
import { MatchJoinedListener } from './socket-helper/Listener/MatchJoinListener';
import ChatMatchEmitter from './socket-helper/Emitter/ChatMatchEmitter';
import { MatchChatListener } from './socket-helper/Listener/MatchChatListener';
import { MatchLeftListener } from './socket-helper/Listener/MatchLeftListener';
import { setUserState, UserState } from './models/user';
import { LogOutListener } from './socket-helper/Listener/LogOutListener';

//crezione dell'istanza del modulo Express
const app = express();
var auth = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });
//utilizziamo delle global middleware functions che possono essere inserite nella pipeline indipendentemente dal metodo HTTP e endpoint usati. Attenzione all'ordine in cui si possono mettere
// in questo caso cors(cross-origin resource sharing) serve nel condividere risorse limitate tra le origini che possono avere domini diversi
app.use(cors());

//estrae l'intero body di una incoming request stream e lo "passa" nel req.body in formato json
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

//qui passiamo tutti i middleware(routes) che implementiamo
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
}); //qui inizializziamo il web socket, Server e' la creazione del server socket

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

    const chatMessage = new ChatMessageListener(client);
    chatMessage.listen();

    const matchJoin = new MatchJoinedListener(ios, client);
    matchJoin.listen();

    const matchChat = new MatchChatListener(client);
    matchChat.listen();

    const matchLeft = new MatchLeftListener(ios,client);
    matchLeft.listen();

    const logOut = new LogOutListener(client);
    logOut.listen();
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
        //client.broadcast.to('id').emit('notification','mimmetto a tutti');
        console.log('Il server socket ha captato: ', data);
        //client.broadcast.emit('notification',"MIMMO BROADCASTATO")
    })
    //client.emit('notification',{mimmo: "el mimmo server"});
})



const matchmakingEngine = new MatchMakingEngine(ios, 5000);
matchmakingEngine.start();

export default ios;
