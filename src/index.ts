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
import authRoutes = require('./routing/auth-routes');
import userRoutes = require('./routing/user-routes');

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


var server = http.createServer(app);
var ios = new Server(server, {
    cors:{
        origin: "*"
    }
}); //qui inizializziamo il web socket, Server e' la creazione del server socket

mongoose.connect(process.env.DB_URI)
    .then(
        () => {
            console.log('Connected to DB'.green);
            ios.on('connection', (client) => {
                console.log("------------------------------------------------".america)
                console.log("Socket.io client ID: ".green + client.id.red + " connected".green);
                
                client.on('disconnect', () => {
                    console.log("------------------------------------------------".america);
                    console.log("Socket.io client ID: ".green + client.id.red + " has been disconnected".yellow);
                })
                client.on('notification', (data) => {
                    //client.broadcast.to('id').emit('notification','mimmetto a tutti');
                    console.log(data);
                })
                client.emit('notification',{mimmo: "el mimmo server"});
            })

            //handling socket needed;
            
            server.listen(8080, () => console.log("HTTP Server started at http://localhost:8080".green));
        }
    ).catch(
        (err) => {
            console.log("Error Occurred during initialization".red);
            console.log(err);
        }
    )

export default ios;
