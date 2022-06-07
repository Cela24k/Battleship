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
exports.__esModule = true;
exports.User = exports.getUserFriends = exports.deleteUser = exports.getAllUsers = exports.getUser = exports.newUser = exports.getModel = exports.getSchema = exports.UserSchema = exports.StatsSchema = exports.Role = void 0;
var mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
var crypto = require("crypto");
var Role;
(function (Role) {
    Role[Role["Mod"] = 0] = "Mod";
    Role[Role["None"] = 1] = "None";
})(Role = exports.Role || (exports.Role = {}));
exports.StatsSchema = new mongoose_1.Schema({
    wins: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    losses: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    winstreak: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    maxWinstreak: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    elo: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    playedGames: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    shotsFired: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    shotsHit: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    },
    timePlayed: {
        type: mongoose_1.SchemaTypes.Date,
        "default": new Date(0)
    },
    rank: {
        type: mongoose_1.SchemaTypes.Number,
        "default": 0
    }
});
exports.StatsSchema.methods.winsAdd = function () {
    this.wins++;
    this.playedGames++;
};
exports.StatsSchema.methods.lossesAdd = function () {
    this.losses++;
    this.playedGames++;
};
exports.StatsSchema.methods.winstreakAdd = function () {
    this.winstreak++;
    if (this.maxWinstreak < this.winstreak)
        this.maxWinstreak = this.winstreak;
};
exports.StatsSchema.methods.winstreakReset = function () {
    this.winstreak = 0;
};
exports.StatsSchema.methods.eloIncrement = function (amount) {
    if (this.elo + amount < 0)
        this.elo = 0;
    else
        this.elo += amount;
};
exports.StatsSchema.methods.accuracySet = function () {
    this.accuracy = this.shotsFired / this.shotsHit;
};
exports.StatsSchema.methods.shotsHitAdd = function () {
    this.wins++;
};
// DA QUA IN POI RIVEDERE
exports.StatsSchema.methods.shotsFiredAdd = function () {
    this.shotsFired++;
    /*if(the shot hit the target)*/
    this.shotsHitAdd();
    this.accuracySet();
};
exports.StatsSchema.methods.timePlayedAdd = function (amount) {
    this.timePlayed += amount;
};
exports.StatsSchema.methods.win = function () {
    this.winsAdd();
    this.winstreakAdd();
};
exports.StatsSchema.methods.lose = function () {
    this.lossesAdd();
    this.winstreakReset();
    this.timePlayedAdd();
};
exports.UserSchema = new mongoose_1.Schema({
    username: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose_1.SchemaTypes.String,
        required: true,
        unique: true
    },
    digest: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    salt: {
        type: mongoose_1.SchemaTypes.String
    },
    role: {
        type: mongoose_1.SchemaTypes.Number,
        "default": Role.None
    },
    friends: {
        type: [mongoose_1.SchemaTypes.ObjectId]
    },
    stats: {
        type: exports.StatsSchema,
        "default": function () { return ({}); }
    },
    playing: {
        type: mongoose_1.SchemaTypes.Boolean,
        "default": false
    }
});
exports.UserSchema.methods.setPassword = function (pwd) {
    this.salt = crypto.randomBytes(16).toString('hex');
    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex'); // The final digest depends both by 
};
exports.UserSchema.methods.validatePassword = function (pwd) {
    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
};
exports.UserSchema.methods.isModerator = function () {
    return this.role == Role.Mod;
};
exports.UserSchema.methods.isWaiting = function () {
    return this.waiting == true;
};
exports.UserSchema.methods.addFriend = function (friend) {
    if (!this.friends.find(friend))
        this.friends.push(friend);
};
exports.UserSchema.methods.setRole = function (role) {
    if (this.role !== role)
        this.role = role;
};
exports.UserSchema.methods.removeFriend = function () {
    /* TODO */
};
exports.UserSchema.methods.getUserPublicInfo = function () {
    var body = {
        username: this.username,
        friends: this.friendlist,
        stats: this.stats,
        isPlaying: this.playing
    };
    return body;
};
exports.UserSchema.methods.makeFriendship = function (userId) {
    return __awaiter(this, void 0, void 0, function () {
        var u1, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, getUser(userId)];
                case 1:
                    u1 = _a.sent();
                    if (!!u1.friends.includes(this._id)) return [3 /*break*/, 4];
                    this.friends.push(userId);
                    u1.friends.push(this._id);
                    return [4 /*yield*/, u1.save()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.save()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, Promise.reject('Users are already friends')];
                case 5: return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, Promise.reject(err_1)];
                case 7: return [2 /*return*/, Promise.resolve()];
            }
        });
    });
};
function getSchema() { return exports.UserSchema; }
exports.getSchema = getSchema;
// Mongoose Model
var userModel; // This is not exposed outside the model
function getModel() {
    if (!userModel) {
        userModel = mongoose_2["default"].model('User', getSchema());
    }
    return userModel;
}
exports.getModel = getModel;
function newUser(data) {
    var user = new exports.User(data);
    return user;
}
exports.newUser = newUser;
function getUser(userid) {
    return __awaiter(this, void 0, void 0, function () {
        var projection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projection = {
                        username: true,
                        stats: true,
                        playing: true
                    };
                    return [4 /*yield*/, exports.User.findOne({ _id: userid }, projection)["catch"](function (err) { return Promise.reject('Server error'); })];
                case 1:
                    result = _a.sent();
                    if (result)
                        return [2 /*return*/, Promise.resolve(result)];
                    else
                        return [2 /*return*/, Promise.reject('No user with such Id')]; //mettere dentro un errore?
                    return [2 /*return*/];
            }
        });
    });
}
exports.getUser = getUser;
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var projection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projection = {
                        username: true,
                        stats: true,
                        playing: true
                    };
                    return [4 /*yield*/, exports.User.find({}, projection)["catch"](function (err) {
                            return Promise.reject('Server Error');
                        })];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2 /*return*/, Promise.reject('There are no users ;D')];
                    return [2 /*return*/, Promise.resolve(result)];
            }
        });
    });
}
exports.getAllUsers = getAllUsers;
function deleteUser(userid) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.User.deleteOne({ _id: userid })["catch"](function (err) { return Promise.reject('Server Error'); })];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2 /*return*/, Promise.reject('There are no users with such id')];
                    return [2 /*return*/, Promise.resolve(result)];
            }
        });
    });
}
exports.deleteUser = deleteUser;
function getUserFriends(userid) {
    return __awaiter(this, void 0, void 0, function () {
        var projection, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projection = {
                        friends: true
                    };
                    return [4 /*yield*/, exports.User.findById(userid, projection)["catch"](function (err) { return Promise.reject('Server Error'); })];
                case 1:
                    result = _a.sent();
                    if (!result)
                        return [2 /*return*/, Promise.reject('There are no users with such id')];
                    return [2 /*return*/, Promise.resolve(result.friends)];
            }
        });
    });
}
exports.getUserFriends = getUserFriends;
exports.User = getModel();
