"use strict";
exports.__esModule = true;
exports.getModel = exports.getSchema = exports.UserSchema = exports.StatsSchema = void 0;
var mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
var Role;
(function (Role) {
    Role[Role["Admin"] = 0] = "Admin";
    Role[Role["Mod"] = 1] = "Mod";
    Role[Role["None"] = 2] = "None";
})(Role || (Role = {}));
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
    }
});
exports.UserSchema = new mongoose_1.Schema({
    username: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    pass: {
        type: mongoose_1.SchemaTypes.String,
        required: true
    },
    salt: {
        type: mongoose_1.SchemaTypes.String
    },
    role: mongoose_1.SchemaTypes.Number,
    friends: {
        type: [mongoose_1.SchemaTypes.ObjectId]
    },
    chats: {
        type: [mongoose_1.SchemaTypes.Number]
    },
    stats: {
        type: exports.StatsSchema
    }
});
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
