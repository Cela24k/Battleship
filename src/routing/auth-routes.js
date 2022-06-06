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
var express_1 = require("express");
var user = require("../models/user");
var passport = require("passport"); // authentication middleware for Express
var passportHTTP = require("passport-http"); // implements Basic and Digest authentication for HTTP (used for /login endpoint)
var jsonwebtoken = require("jsonwebtoken");
var router = express_1.Router();
passport.use(new passportHTTP.BasicStrategy(function (username, password, done) {
    // "done" callback (verify callback) documentation:  http://www.passportjs.org/docs/configure/
    // Delegate function we provide to passport middleware
    // to verify user credentials 
    console.log("New login attempt from ".green + username.red);
    user.getModel().findOne({ username: username }, function (err, user) {
        console.log('QUI VIENE VALIDATA LA PASS' + password);
        if (err) {
            return done({ statusCode: 500, error: true, errormessage: err });
        }
        if (!user) {
            return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid user!" });
        }
        if (user.validatePassword(password)) {
            return done(null, user);
        }
        return done(null, false, { statusCode: 500, error: true, errormessage: "Invalid password!" });
    });
}));
router.get('/login', passport.authenticate('basic', { session: false }), function (req, res) {
    var _a = req.user, username = _a.username, email = _a.email, role = _a.role, _id = _a._id;
    var tokendata = {
        username: username,
        role: role,
        email: email,
        _id: _id
    };
    var token = jsonwebtoken.sign(tokendata, process.env.JWT_SECRET, { expiresIn: '3h' }); //settare un expires giusto
    console.log(token.toString());
    return res.status(200).json({ error: false, errormessage: "", token: token });
});
/**
 * It registers a user
 */
router.post('/register', function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, email, password, userDoc, u;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.body, username = _a.username, email = _a.email, password = _a.password;
                    console.log(req.body);
                    console.log(username, email);
                    return [4 /*yield*/, user.getModel().findOne({ email: email, username: username })];
                case 1:
                    userDoc = _b.sent();
                    if (!!userDoc) return [3 /*break*/, 3];
                    u = user.newUser({
                        username: username,
                        email: email
                    });
                    u.setPassword(password);
                    return [4 /*yield*/, u.save().then(function (data) {
                            return res.status(200).json({ error: false, errormessage: "", id: data._id });
                        })["catch"](function () {
                            return res.status(400).json({ error: true, errormessage: "Something has been wrong with registration!" });
                        })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, res.status(400).json({ error: true, errormessage: "User already exist" })];
                case 4: return [2 /*return*/];
            }
        });
    });
});
module.exports = router;
