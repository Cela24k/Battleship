import { Document, Model, Schema, Types, SchemaTypes, SchemaType} from "mongoose";
import mongoose from "mongoose";
import { ChatInterface } from "./chat";
import { NotificationType , NotificationInterface } from "./notification";

export enum Role {
    Admin,
    Mod,
    None
}

export interface UserInterface extends Document {
    username: string,
    email:string,
    pass:string,
    salt: string,
    role: Role,
    friends:[Types.ObjectId], // by reference ?
    chats:[ChatInterface],  //by copy ?
    stats: StatsInterface,
    notifications: [NotificationInterface],

    /* this could be useful for the Matchmaking,
    *  a match shouldn't start unless both players are waiting and if 
    *  something bad happens in the meantime, this field is set to false 
    */
    waiting: boolean, 

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

    removeFriend(friend: Types.ObjectId): void;

    blockFriend(friend: Types.ObjectId): void;

    /* Invites a friend to a game with a notification*/
    gameNotification(friend: Types.ObjectId): void;

    /* Sends a friend notification, the addFriend function is called 
    *  if it is accepted */
    friendNotification(friend: Types.ObjectId): void;
    
    /* Sets this User's role */
    setRole(): void;
} 

export interface StatsInterface {
    wins: number,
    losses: number,
    winstreak: number,
    maxWinstreak: number,
    previousMatch: boolean,
    elo: number,
    playedGames: number,
    shotsFired:number,
    shotsHit:number,
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
    shotsFired:{
        type: SchemaTypes.Number,
        default:0
    },
    shotsHit:{
        type: SchemaTypes.Number,
        default:0
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
        unique : true
    },
    pass: {
        type: SchemaTypes.String,
        required: true,
    },
    salt: {
        type: SchemaTypes.String,
    },
    role: SchemaTypes.Number,
    friends: {
        type: [SchemaTypes.ObjectId],
    },
    chats: {
        type: [SchemaTypes.Subdocument],
    },
    stats: {
        type: StatsSchema,
    }
})



export function getSchema() { return UserSchema; }

// Mongoose Model
var userModel;  // This is not exposed outside the model
export function getModel() : Model< Document > { // Return Model as singleton
    if( !userModel ) {
        userModel = mongoose.model('User', getSchema() )
    }
    return userModel;
}

