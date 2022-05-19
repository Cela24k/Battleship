import { Document, Model, Schema, Types, SchemaTypes, SchemaType } from "mongoose";
import mongoose from "mongoose";
import { ChatInterface } from "./chat";
import { NotificationType, NotificationInterface } from "./notification";
import * as crypto from "crypto";

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

    /* this could be useful for the Matchmaking,
    *  a match shouldn't start unless both players are waiting and if 
    *  something bad happens in the meantime, this field is set to false 
    */
    waiting: boolean,

    /* Sets the hasahed password */

    setPassword(pwd: String): void,

    /* Validate the hasahed password */

    validatePassword(pwd: String): boolean,

    /* Returns true if this user's role field is set to "Role.Admin" */
    isAdmin(): boolean;

    /* Returns true if this user's role field is set to "Role.Admin" */
    isModerator(): boolean;

    /* Handy in the matchmaking, read "waiting" property.
    * Returns true if the player is looking for a match 
    */
    isWaiting(): boolean;

    /* Sends a notification to the other user to ask for friendship */
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
    setRole(): void;
    // addChat(): void, // vedere che parametri ha bisogno 
    // removeChat(): void,//stessa cosa
}



export interface StatsInterface {
    wins: number,
    losses: number,
    winstreak: number,
    maxWinstreak: number,
    previousMatch: boolean,
    elo: number,
    playedGames: number,
    shotsFired: number,
    shotsHit: number,
    timePlayed: Date,
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
    }
})

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
    // chats: {   //TODO implementare i models delle chat ricordare di togliere dal database gli utenti creati precedentemente
    //     type: [SchemaTypes.SubDocument],
    // },
    stats: {
        type: StatsSchema,
    }

})

UserSchema.methods.setPassword = function (pwd: string) {
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
