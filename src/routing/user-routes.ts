import * as express from "express";
import {Router} from "express";

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
 *     /users                                   -               POST           Add a new user
 *     /login                                   -               POST           login an existing user, returning a JWT
 *  */
