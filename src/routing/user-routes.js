"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var user = require("../models/user");
var user_1 = require("../models/user");
var express_1 = require("express");
var jsonwebtoken = require("jsonwebtoken");
var mongoose_1 = require("mongoose");
var __1 = require("..");
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
// DONE
// Returns a list of all users' public data: id, username, stats, playing
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user.getAllUsers()];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                if (err_1 === 'Server error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_1, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_1, timestamp: Date.now() })];
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, res.status(200).json(result)];
        }
    });
}); });
// DONE
// Returns the public data of the user identified by {:userId} if it exists, else throws error 404 
router.get('/:userid', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user.getUser(new mongoose_1.Types.ObjectId(req.params.userid))];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                if (err_2 === 'Server error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_2, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_2, timestamp: Date.now() })];
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/, res.status(200).json(result)];
        }
    });
}); });
// Deletes the user identified by {:userId} 
// A moderator can delete all users 
// A regular user can use this endpoint only with his own {:userId}
router["delete"]('/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, result, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
                if (!(jwt['_id'] === req.params.userId || jwt['role'] === user_1.Role.Mod)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user.deleteUser(new mongoose_1.Types.ObjectId(req.params.userId))];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                if (err_3 === 'Server Error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_3, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_3, timestamp: Date.now() })];
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, res.status(200).json(result)];
            case 5: return [2 /*return*/, res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() })];
        }
    });
}); });
//vedere se farlo
router.patch('/:userId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
                if (!(jwt['role'] === user_1.Role.Mod)) return [3 /*break*/, 2];
                return [4 /*yield*/, user.getModel().findOneAndUpdate({ _id: req.params.userId }, {})];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
//Returns a user's list of friends if it exists
router.get('/:userId/friends', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
                if (!(jwt['_id'] === req.params.userId || jwt['role'] === user_1.Role.Mod)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user.getUserFriends(new mongoose_1.Types.ObjectId(req.params.userId))];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                if (err_4 === 'Server Error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_4, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_4, timestamp: Date.now() })];
                return [3 /*break*/, 4];
            case 4:
                if (result.length === 0)
                    return [2 /*return*/, res.status(200).json({ error: false, message: 'This user has no friends ;(', timestamp: Date.now() })];
                return [2 /*return*/, res.status(200).json(result)];
            case 5: return [2 /*return*/, res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() })];
        }
    });
}); });
//Sends a friend request 
// TODO use websocket
router.put('/:userId/friends/:friendId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, sender, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
                if (!(jwt['_id'] === req.params.userId || jwt['role'] === user_1.Role.Mod)) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user.getUser(new mongoose_1.Types.ObjectId(req.params.userId))];
            case 2:
                sender = _a.sent();
                return [4 /*yield*/, sender.friendNotification(new mongoose_1.Types.ObjectId(req.params.friendId))];
            case 3:
                _a.sent();
                __1["default"]["in"](req.params.friendId).emit('notification', { notification: 'placeholder' });
                return [3 /*break*/, 5];
            case 4:
                err_5 = _a.sent();
                if (err_5 === 'Server Error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_5, timestamp: Date.now() })];
                else if (err_5 === 'Notification already sent')
                    return [2 /*return*/, res.status(409).json({ error: true, errormessage: err_5, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_5, timestamp: Date.now() })];
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, res.status(200).json({ error: false, message: 'Friend request sent', timestamp: Date.now() })];
            case 6: return [2 /*return*/, res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() })];
        }
    });
}); });
router.get('/:userId/notifications', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var jwt, u, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
                if (!(jwt['_id'] === req.params.userId || jwt['role'] === user_1.Role.Mod)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user.User.findById(new mongoose_1.Types.ObjectId(req.params.userId))];
            case 2:
                u = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_6 = _a.sent();
                if (err_6 === 'Server Error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_6, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_6, timestamp: Date.now() })];
                return [3 /*break*/, 4];
            case 4:
                if (u.notifications)
                    return [2 /*return*/, res.status(200).json(u.notifications)];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: 'The user has no notifications', timestamp: Date.now() })];
                _a.label = 5;
            case 5: return [2 /*return*/, res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() })];
        }
    });
}); });
//accept a notification
//TODO use websocket
router.put('/:userId/notifications/:notificationId', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var action, jwt, u, notification, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                action = req.query.action ? req.query.action : undefined;
                jwt = jsonwebtoken.verify(req.headers.authorization.replace("Bearer ", ""), process.env.JWT_SECRET);
                if (!(jwt['_id'] === req.params.userId || jwt['role'] === user_1.Role.Mod)) return [3 /*break*/, 8];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, user.getModel().findById(new mongoose_1.Types.ObjectId(req.params.userId))];
            case 2:
                u = _a.sent();
                notification = u.notifications.find(function (val) { return (String(val._id) === req.params.notificationId); });
                if (!(action == 'accept')) return [3 /*break*/, 4];
                return [4 /*yield*/, notification.accept()];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, u.removeNotification(notification)];
            case 5:
                _a.sent();
                return [3 /*break*/, 7];
            case 6:
                err_7 = _a.sent();
                if (err_7 === 'Server Error')
                    return [2 /*return*/, res.status(500).json({ error: true, errormessage: err_7, timestamp: Date.now() })];
                else
                    return [2 /*return*/, res.status(404).json({ error: true, errormessage: err_7, timestamp: Date.now() })];
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, res.status(200).json({ error: false, message: 'Notification accepted', timestamp: Date.now() })];
            case 8: return [2 /*return*/, res.status(401).json({ error: true, errormessage: 'No authorization to execute this endpoint', timestamp: Date.now() })];
        }
    });
}); });
module.exports = router;
