"use strict";
var express_1 = require("express");
var user = require("../models/user");
var router = express_1.Router();
router.post('/login', function (req, res) {
});
router.post('/registration', function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password, username = _a.username;
    console.log(req.body);
    if (email) { // TODO controllo email non solo da parte frontend ma anche da backend
        user.getModel().findOne({ email: email }) //vedere in che modo mettere all'interno della richiesta, il nome email cosi da non dover ripetere con lo stesso nome del database
            .then(function (doc) {
            if (!doc) {
                var u = user.newUser({
                    username: username,
                    email: email
                });
                u.setPassword(password);
                u.save().then(function (data) {
                    return res.status(200);
                })["catch"](function (reason) {
                    return res.status(404);
                });
            }
        })["catch"](function (err) {
            return res.status(404).send("Geshborso");
        });
    }
    return res.status(404);
});
module.exports = router;
