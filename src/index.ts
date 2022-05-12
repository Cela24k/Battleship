// importati  imoduli che ci possono servire per l'applicazione
const result = require('dotenv').config(); //loada variabili d'ambiente into process.env:The process.env property returns an object containing the user environment. https://nodejs.org/docs/latest/api/process.html#process_process_env
import fs = require('fs');
import http = require('http');
import colors = require('colors');
colors.enabled = true;
import mongoose = require('mongoose');
import express = require('express');
import bodyparser = require('body-parser');
import passport = require('passport');
import jsonwebtoken = require('jsonwebtoken');
import jwt = require('express-jwt');
import cors = require('cors');
import io = require('socket.io');
import { Http2ServerResponse } from 'http2';



//crezione dell'istanza del modulo Express
const app = express();
//utilizziamo delle global middleware functions che possono essere inserite nella pipeline indipendentemente dal metodo HTTP e endpoint usati. Attenzione all'ordine in cui si possono mettere
// in questo caso cors(cross-origin resource sharing) serve nel condividere risorse limitate tra le origini che possono avere domini diversi
app.use(cors());
//estrae l'intero body di una incoming request stream e lo "passa" nel req.body
app.use(bodyparser.json())

app.use( (req,res,next) => {
    console.log("------------------------------------------------".inverse)
    console.log("Method: "+req.method.cyan+" Endpoint : "+req.url.blue);
    next();
  })

// TODO vedere in che modo conviene creare il server, se dopo aver connesso il database o prima, Mettere nel .env url mongo, jwt ecc.
mongoose.connect("mongodb+srv://admin:admin@cluster0.ui3ec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(
        () => {
            console.log('Connected to DB'.green);
            let server = http.createServer(app);
            server.listen(8080, () => console.log("HTTP Server started on port 8080".green));
        }
    ).catch(
        (err) => {
            console.log("Error Occurred during initialization".red);
            console.log(err);
        }
    )