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
var express_jwt_1 = require("express-jwt");
var cors = require("cors");
var authRoutes = require("./routing/auth-routes");
var userRoutes = require("./routing/user-routes");
//crezione dell'istanza del modulo Express
var app = express();
var auth = express_jwt_1.expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] });
//utilizziamo delle global middleware functions che possono essere inserite nella pipeline indipendentemente dal metodo HTTP e endpoint usati. Attenzione all'ordine in cui si possono mettere
// in questo caso cors(cross-origin resource sharing) serve nel condividere risorse limitate tra le origini che possono avere domini diversi
app.use(cors());
//estrae l'intero body di una incoming request stream e lo "passa" nel req.body in formato json
app.use(bodyparser.json());
app.use(function (req, res, next) {
    console.log("------------------------------------------------".rainbow);
    console.log("Method: " + req.method.cyan + " Endpoint : " + req.url.red + "StatusCode" + res.statusCode);
    next();
});
app.get("/", function (req, res) {
    res.status(200).json({ api_version: "1.0", endpoints: ["/auth", "/user"] });
});
//qui passiamo tutti i middleware(routes) che implementiamo
app.use('/auth', authRoutes);
app.use('/user', auth, userRoutes);
mongoose.connect(process.env.DB_URI)
    .then(function () {
    console.log('Connected to DB'.green);
    var server = http.createServer(app);
    server.listen(8080, function () { return console.log("HTTP Server started at http://localhost:8080".green); });
})["catch"](function (err) {
    console.log("Error Occurred during initialization".red);
    console.log(err);
});
