"use strict";
var user = require("../models/user");
var express_1 = require("express");
var router = express_1.Router();
/*
    ENDPOINTS	        ATTRIBUTES	    METHOD	    DESCRIPTION
    /users		                        GET	        Returns a list of all users if the client is a moderator
            
    /users		                        POST	    Create a new user if the client is a moderator
                                                    (Maybe replaced by /register or just use this endpoint in the register section)

    /users	            ?name=	        GET	        Returns the userS containing the specified name
    /users/:userId		                GET	        Returns the user specified by its id, if it exists
    /users/:userId		                DELETE	    Deletes the specified user if it exists
    /users/:userId		                PATCH	    Edit a user with the body of the request
    
 **/
router.get('/list', function (req, res) {
    console.log("GIUSTO ED AUTENTICATO"); //Debugging tool for auth
    res.send(202);
});
router.get('/', function (req, res) {
    //da prendere dal token idk
    var moderator = true;
    if (moderator)
        return res.status(200).json({ error: false });
    else
        return res.status(400).json({ error: true, erorrmessage: "Non sei autenticato" });
});
router.get('/', function (req, res) {
    var moderator = true;
    if (req.params /*se ha un parametro tipo /users?name='mimmo' */)
        return user.getModel().find({ username: req.params /* .name */ }); //ritorna una lista di users con quel nome
    else if (moderator)
        return user.getModel(); //intera tabella users
});
module.exports = router;
