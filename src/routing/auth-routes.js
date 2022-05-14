"use strict";
var express_1 = require("express");
var user = require("../models/user");
var router = express_1.Router();
router.post('/login', function (req, res) {
});
router.post('/registration', function (req, res) {
    var email = req.body.email;
    if (email) {
        user.getModel().findOne({ email: email }) //vedere in che modo mettere all'interno della richiesta, il nome email cosi da non dover ripetere con lo stesso nome del database
            .then(function (doc) {
            if (!doc) {
                //create a new User con email e password
            }
        });
    }
});
module.exports = router;
