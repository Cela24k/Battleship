"use strict";
exports.__esModule = true;
exports.newUser = exports.getModel = exports.getSchema = exports.UserSchema = exports.StatsSchema = exports.Role = void 0;
var mongoose_1 = require("mongoose");
var mongoose_2 = require("mongoose");
var crypto = require("crypto");
var Role;
(function (Role) {
    Role[Role["Admin"] = 0] = "Admin";
    Role[Role["Mod"] = 1] = "Mod";
    Role[Role["None"] = 2] = "None";
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
        type: mongoose_1.SchemaTypes.Boolean,
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
/*winsAdd(): void,
    lossesAdd(): void,
    winstreakAdd(): void,
    winstreakReset(): void,
    eloIncrement(value: number): void,
    shotsFiredAdd(): void,
    shotsHitAdd(): void,
    accuracySet(): void,
    timePlayedAdd(amount: Date): void,
    win(): void,
    lose(): void,
*/
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
    // chats: {   //TODO implementare i models delle chat ricordare di togliere dal database gli utenti creati precedentemente
    //     type: [SchemaTypes.SubDocument],
    // },
    stats: {
        type: exports.StatsSchema
    }
});
exports.UserSchema.methods.setPassword = function (pwd) {
    console.log('Ghesbor');
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
exports.UserSchema.methods.isAdmin = function () {
    return this.role == Role.Admin;
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
    console.log(data);
    var _userModel = getModel();
    var user = new _userModel(data);
    return user;
}
exports.newUser = newUser;
