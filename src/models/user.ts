import { Document, Model, Schema, Types, SchemaTypes, SchemaType} from "mongoose";
import mongoose from "mongoose";
import { ChatInterface } from "./chat";

enum Role {
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
    },
    email: {
        type: SchemaTypes.String,
        required: true,
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

