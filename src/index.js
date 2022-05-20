"use strict";
exports.__esModule = true;
// importati  imoduli che ci possono servire per l'applicazione
var result = require('dotenv').config(); //loada variabili d'ambiente into process.env:The process.env property returns an object containing the user environment. https://nodejs.org/docs/latest/api/process.html#process_process_env
var http = require("http");
var colors = require("colors");
colors.enabled = true;
var mongoose = require("mongoose");
var express = require("express");
var bodyparser = require("body-parser");
var cors = require("cors");
var authRoutes = require("./routing/auth-routes");
//crezione dell'istanza del modulo Express
var app = express();
//utilizziamo delle global middleware functions che possono essere inserite nella pipeline indipendentemente dal metodo HTTP e endpoint usati. Attenzione all'ordine in cui si possono mettere
// in questo caso cors(cross-origin resource sharing) serve nel condividere risorse limitate tra le origini che possono avere domini diversi
app.use(cors());
//estrae l'intero body di una incoming request stream e lo "passa" nel req.body
app.use(bodyparser.urlencoded());
app.use(bodyparser.json());
//
app.use(function (req, res, next) {
    console.log("------------------------------------------------".inverse);
    console.log("Method: " + req.method.cyan + " Endpoint : " + req.url.red + req.body);
    next();
});
app.get("/", function (req, res) {
    res.status(200).json({ api_version: "1.0", endpoints: ["/auth", "/user"] }); // json method sends a JSON response (setting the correct Content-Type) to the client
});
//qui passiamo tutti i middleware(routes) che implementiamo
app.use('/auth', authRoutes);
// TODO vedere in che modo conviene creare il server, se dopo aver connesso il database o prima, Mettere nel .env url mongo, jwt ecc.
mongoose.connect("mongodb+srv://admin:admin@cluster0.ui3ec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(function () {
    console.log('Connected to DB'.green);
    var server = http.createServer(app);
    server.listen(8080, function () { return console.log("HTTP Server started at http://localhost:8080".green); });
})["catch"](function (err) {
    console.log("Error Occurred during initialization".red);
    console.log(err);
});
