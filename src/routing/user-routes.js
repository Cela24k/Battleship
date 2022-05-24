"use strict";
var express_1 = require("express");
var router = express_1.Router();
/*
*  Endpoints                                 Attributes         Method         Description
 *     /user                                    -               GET            Returns all the users.
 *     /user/:userId/friends                    -               GET            Returns all the user referred with :userId friends.
 *     /user/:userId/stats                      -               GET            Return the user statistics
 *     /messages/:id                            -               DELETE         Delete a message by id
 *     /tags                                    -               GET            Get a list of tags
 *
 *     /users                                   -               GET            List all users
 *     /users/:mail                             -               GET            Get user info by mail
 *   */
router.get('/list', function (req, res) {
    console.log("GIUSTO ED AUTENTICATO");
    res.send(202);
});
module.exports = router;
