import { Document, Model, Schema, Types, SchemaTypes, SchemaType } from "mongoose";
import mongoose from "mongoose";
import { ChatInterface } from "./chat";
import { NotificationType, NotificationInterface } from "./notification";
import * as crypto from "crypto";
import { Stats } from "fs";

export enum Role {
    Admin,
    Mod,
    None
}

export interface UserInterface extends Document {
    username: string,
    email: string,
    digest: string,
    salt: string,
    role: Role,
    friends: [Types.ObjectId], // by reference ?
    //chats: [ChatInterface],  //by copy ?
    stats: StatsInterface,
    notifications: [NotificationInterface],
    playing:boolean,

    /* this could be useful for the Matchmaking,
    *  a match shouldn't start unless both players are waiting and if 
    *  something bad happens in the meantime, this field is set to false 
    */
    waiting: boolean,

    /* Sets the hasahed password */

    setPassword(pwd: String): void,

    /* Validate the hashed password */

    validatePassword(pwd: String): boolean,

    /* Returns true if this user's role field is set to "Role.Admin" */
    isAdmin(): boolean;

    /* Returns true if this user's role field is set to "Role.Admin" */
    isModerator(): boolean;

    /* Handy in the matchmaking, read "waiting" property.
    * Returns true if the player is looking for a match 
    */
    isWaiting(): boolean;

    isPlaying(): boolean;

    /* Directly adds a user to this user's friendlist */
    addFriend(friend: Types.ObjectId): void;

    //TODO vedere se si elimina uno alla volta, in caso contrario dobbiamo mettere come parametri un array di id
    removeFriend(friend: Types.ObjectId): void;

    blockFriend(friend: Types.ObjectId): void;

    /* Invites a friend to a game with a notification*/
    gameNotification(friend: Types.ObjectId): void;

    /* Sends a friend notification, the addFriend function is called 
    *  if it is accepted */
    friendNotification(friend: Types.ObjectId): void;

    /* Sets this User's role */
    setRole(role: Role): void;
    // addChat(): void, // vedere che parametri ha bisogno 
    // removeChat(): void,//stessa cosa

    getUserPublicInfo(): void; 

}



export interface StatsInterface {
    wins: number,
    losses: number,
    winstreak: number,
    maxWinstreak: number,
    elo: number,
    playedGames: number,
    shotsFired: number,
    shotsHit: number,
    accuracy: number,
    timePlayed: Date,
    rank: number,

    winsAdd(): void,
    lossesAdd(): void,
    winstreakAdd(): void,
    winstreakReset(): void,
    eloIncrement(value: number): void,
    shotsFiredAdd(): void,
    shotsHitAdd(): void,
    accuracySet(): void,
    timePlayedAdd(amount: Date): void,
    rankSet(): void,
    win(): void,
    lose(): void,
}

export const StatsSchema = new Schema<StatsInterface>({
    wins: {
        type: SchemaTypes.Number,
        default: 0,
    },
    losses: {
        type: SchemaTypes.Number,
        default: 0,
    },
    winstreak: {
        type: SchemaTypes.Number,
        default: 0,
    },
    maxWinstreak: {
        type: SchemaTypes.Number,
        default: 0,
    },
    elo: {
        type: SchemaTypes.Number,
        default: 0,
    },
    playedGames: {
        type: SchemaTypes.Number,
        default: 0,
    },
    shotsFired: {
        type: SchemaTypes.Number,
        default: 0
    },
    shotsHit: {
        type: SchemaTypes.Number,
        default: 0
    },
    timePlayed: {
        type: SchemaTypes.Date,
        default: new Date(0),
    },
    rank: {
        type: SchemaTypes.Number,
        default: 0
    }
})

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

StatsSchema.methods.winsAdd = function(): void {
    this.wins++;
    this.playedGames++;
}

StatsSchema.methods.lossesAdd = function(): void {
    this.losses++;
    this.playedGames++;
}

StatsSchema.methods.winstreakAdd = function(): void {
    this.winstreak++;
    if(this.maxWinstreak < this.winstreak) 
        this.maxWinstreak = this.winstreak;
}

StatsSchema.methods.winstreakReset = function(): void {
    this.winstreak = 0;
}

StatsSchema.methods.eloIncrement = function(amount: number): void {
    if(this.elo + amount < 0 )
        this.elo = 0;
    else this.elo += amount;
}
StatsSchema.methods.accuracySet = function(): void {
    this.accuracy = this.shotsFired / this.shotsHit;
}
StatsSchema.methods.shotsHitAdd = function(): void {
    this.wins++;
}

// DA QUA IN POI RIVEDERE

StatsSchema.methods.shotsFiredAdd = function(): void {
    this.shotsFired++;
    /*if(the shot hit the target)*/
        this.shotsHitAdd();
    this.accuracySet();
}
StatsSchema.methods.timePlayedAdd = function(amount: Date): void {
    this.timePlayed += amount;
}
StatsSchema.methods.win = function(): void {
    this.winsAdd();
    this.winstreakAdd();
}
StatsSchema.methods.lose = function(): void {
    this.lossesAdd();
    this.winstreakReset();

    this.timePlayedAdd();
}

export class EmptyStats implements StatsInterface {
    wins: 0;
    losses: 0;
    winstreak: 0;
    maxWinstreak: 0;
    elo: 0;
    playedGames: 0;
    shotsFired: 0;
    shotsHit: 0;
    accuracy: 0;
    timePlayed: Date;
    rank: 0;
    winsAdd(): void {
        throw new Error("Method not implemented.");
    }
    lossesAdd(): void {
        throw new Error("Method not implemented.");
    }
    winstreakAdd(): void {
        throw new Error("Method not implemented.");
    }
    winstreakReset(): void {
        throw new Error("Method not implemented.");
    }
    eloIncrement(value: number): void {
        throw new Error("Method not implemented.");
    }
    shotsFiredAdd(): void {
        throw new Error("Method not implemented.");
    }
    shotsHitAdd(): void {
        throw new Error("Method not implemented.");
    }
    accuracySet(): void {
        throw new Error("Method not implemented.");
    }
    timePlayedAdd(amount: Date): void {
        throw new Error("Method not implemented.");
    }
    rankSet(): void {
        throw new Error("Method not implemented.");
    }
    win(): void {
        throw new Error("Method not implemented.");
    }
    lose(): void {
        throw new Error("Method not implemented.");
    }
    
}

let emptySt = {
    
}

export const UserSchema = new Schema<UserInterface>({
    username: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    email: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    digest: {
        type: SchemaTypes.String,
        required: true,
    },
    salt: {
        type: SchemaTypes.String,
    },
    role: {
        type: SchemaTypes.Number,
        default: Role.None,
    },
    friends: {
        type: [SchemaTypes.ObjectId],
    },
    stats: {
        type: StatsSchema,
        default: new EmptyStats,
    }

})

UserSchema.methods.setPassword = function (pwd: string): void {
    console.log('Ghesbor');
    this.salt = crypto.randomBytes(16).toString('hex');
    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex'); // The final digest depends both by 

}

UserSchema.methods.validatePassword = function (pwd: string): boolean {

    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
}

UserSchema.methods.isAdmin = function (): boolean {
    return this.role == Role.Admin;
}

UserSchema.methods.isModerator = function (): boolean {
    return this.role == Role.Mod;
}

UserSchema.methods.isWaiting = function (): boolean {
    return this.waiting == true;
}

UserSchema.methods.addFriend = function (friend: Types.ObjectId): void {
    if (!this.friends.find(friend)) 
        this.friends.push(friend);
}

UserSchema.methods.setRole = function (role: Role): void {
    if (this.role !== role) this.role = role;
}
UserSchema.methods.removeFriend = function (): void {
    /* TODO */
}

UserSchema.methods.getUserPublicInfo = function(): Object {
    let body = {
        username: this.username,
        friends: this.friendlist,
        stats: this.stats,
        isPlaying: this.playing
    }

    return body;
}
export function getSchema() { return UserSchema; }

// Mongoose Model
var userModel;  // This is not exposed outside the model
export function getModel(): Model<UserInterface> { // Return Model as singleton
    if (!userModel) {
        userModel = mongoose.model('User', getSchema())
    }
    return userModel;
}

export function newUser(data: any): UserInterface {
    console.log(data);
    const _userModel = getModel();
    var user = new _userModel(data);

    return user;
}
