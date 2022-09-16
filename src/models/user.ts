import { Document, Model, Schema, Types, SchemaTypes, SchemaType } from "mongoose";
import mongoose from "mongoose";
import { ChatInterface, ChatModel, ChatSchema } from "./chat";
import { NotificationType, NotificationInterface, newNotification, NotificationSchema } from "./notification";
import * as crypto from "crypto";
import { stat, Stats } from "fs";
import { DeleteResult, UpdateResult } from "mongodb";
import { StatsInterface, StatsSchema } from "./user-stats";
import { StateChangeEmitter } from "../socket-helper/Emitter/StateChangeEmitter";
import ios from "..";

export enum Role {
    Mod,
    None
}
export enum UserState {
    Playing = "Playing",
    Online = "Online",
    Offline = "Offline",
    Observing = "Observing",
    Waiting = "Waiting",
}

export interface UserInterface extends Document {
    username: string,
    email: string,
    digest: string,
    salt: string,
    role: Role,
    friends: Types.ObjectId[], 
    state: UserState,
    stats: StatsInterface,
    notifications: NotificationInterface[],

    chats: Types.ObjectId[],



    /* Sets the hasahed password */

    setPassword(pwd: String): void,

    /* Validate the hashed password */

    validatePassword(pwd: String): boolean,



    friendNotification(friend: Types.ObjectId): Promise<boolean>;
    removeNotification(notification: NotificationInterface): Promise<void>;
    setRole(role: Role): void;
    addChat(chat: ChatInterface): void;
    getChats(): Promise<ChatInterface[]>;
    getFriendsId(): Promise<Types.ObjectId[]>;

    changeModInfo(username: string, email: string): Promise<UserInterface>;
}

enum PlayerState {
    Playing = "Playing",
    Observing = "Observing",
}




export const UserSchema = new Schema<UserInterface>({
    username: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    email: {
        type: SchemaTypes.String,
        default: ""
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
        default: () => ({}),
    },
    state: {
        type: SchemaTypes.String,
        enum: UserState,
        default: UserState.Offline

    },
    notifications: {
        type: [NotificationSchema],
    },
    chats: {
        type: [SchemaTypes.ObjectId],
    }

})

UserSchema.methods.setPassword = function (pwd: string): void {
    this.salt = crypto.randomBytes(16).toString('hex');
    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    this.digest = hmac.digest('hex'); 

}

UserSchema.methods.validatePassword = function (pwd: string): boolean {

    var hmac = crypto.createHmac('sha512', this.salt);
    hmac.update(pwd);
    var digest = hmac.digest('hex');
    return (this.digest === digest);
}

UserSchema.methods.setRole = function (role: Role): void {
    if (this.role !== role) this.role = role;
}



UserSchema.methods.friendNotification = async function (userId: Types.ObjectId): Promise<void> {
    let u = await User.findById(userId, { notifications: true }).catch(
        (err) => Promise.reject('Server Error')
    );
    if (this.id === userId) return Promise.reject('Cannot add yourself as a friend');
    if (u) {
        let flag = true;
        u.notifications.forEach(function (x) {
            if (x.sender == this.id) {
                flag = false;
            }
        }, this)
        if (!flag) return Promise.reject('Notification already sent');

        let n = await newNotification(this.username, this.id, userId, NotificationType.Friend);

        u.notifications.push(n);
        let res = await u.save().catch(
            (err) => Promise.reject('Server Error')
        )
        if (res)
            return Promise.resolve();
        else
            return Promise.reject('Server Error');
    }
    else return Promise.reject('There are no users with such id')
}


UserSchema.methods.removeNotification = async function (notification: NotificationInterface): Promise<void> {//TODO vedere che pattern mettere sulla save
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
        this.notifications.splice(index, 1);
    }
    try {
        await this.save();
    } catch (err) {
        return Promise.reject(err)
    }
    return Promise.resolve();
}


UserSchema.methods.getChats = async function (): Promise<ChatInterface[]> {
    const chatList = await ChatModel.find({
        '_id': {
            $in: this.chats
        }
    });

    return Promise.resolve(chatList);
}


UserSchema.methods.addChat = async function (chat: ChatInterface): Promise<void> {//TODO need a look on the condition
    let flag = false;
    const chats = await this.getChats();
    chats.forEach((c: ChatInterface) => {
        if (c.users.every((u: Types.ObjectId) => chat.users.includes(u))) {// check if the same ids of the param chat are included on my own chats. All of this involves that when a chat is destroyed, it is destroyed for both users.
            flag = true;
        }
    })
    if (!flag) {
        this.chats.push(chat._id);
        try {
            await this.save();
        } catch (err) {
            return Promise.reject(err);
        }
    } else {
        return Promise.reject("Already Exist");
    } 
    return Promise.resolve();
}


UserSchema.methods.getFriendsId = async function () {
    return this.friends
}

UserSchema.methods.changeModInfo = async function (username: string, email: string): Promise<void> {
    if (username.length == 0 || email.length == 0) {
        throw new Error("Manca un qualcosotto")
    }
    this.username = username;
    this.email = email;
    return this.save();
}


export function getSchema() { return UserSchema; }


var userModel;  
export function getModel(): Model<UserInterface> {
    if (!userModel) {
        userModel = mongoose.model('User', getSchema())
    }
    return userModel;
}

export function newUser(data: any): UserInterface {
    var user = new User(data);
    return user;
}

export async function getUser(userid: Types.ObjectId): Promise<UserInterface> {
    const projection = {
        username: true,
        stats: true,
        playing: true
    }
    let result = await User.findById({ _id: userid }, projection).catch(
        (err) => Promise.reject('Server error')
    );
    if (result) return Promise.resolve(result);
    else return Promise.reject('No user with such Id');
}

export async function getUserById(userid: Types.ObjectId): Promise<UserInterface> {

    let result = await User.findById({ _id: userid }).catch(
        (err) => Promise.reject('Server error')
    );
    if (result) return Promise.resolve(result);
    else return Promise.reject('No user with such Id');
}

export async function getOnlineUsers(): Promise<UserInterface[]> {
    const projection = {
        id: true,
        stats: true,
        state: true,
        username: true
    }
    let result = await User.find({ state: UserState.Online }, projection).catch((err) => {
        return Promise.reject('Server Error');
    });
    if (!result)
        return Promise.reject('There are no users ;D');
    return Promise.resolve(result);
}

export async function getAllUsers(): Promise<UserInterface[]> {
    const projection = {
        username: true,
        stats: true,
        state: true,
    }
    let result = await User.find({}, projection).catch((err) => {
        return Promise.reject('Server Error');
    });
    if (!result)
        return Promise.reject('There are no users ;D');
    return Promise.resolve(result);
}

export async function deleteUser(userid: Types.ObjectId): Promise<DeleteResult> {
    let result = await User.deleteOne({ _id: userid }).catch(
        (err) => Promise.reject('Server Error')
    );
    if (!result)
        return Promise.reject('There are no users with such id')
    return Promise.resolve(result);
}

export async function getUserFriends(userid: Types.ObjectId): Promise<Types.ObjectId[]> {
    let projection = {
        friends: true,
    }
    let result = await User.findById(userid, projection).catch(
        (err) => Promise.reject('Server Error')
    );
    if (!result)
        return Promise.reject('There are no users with such id');
    return Promise.resolve(result.friends);
}

export async function makeFriendship(user1: Types.ObjectId, user2: Types.ObjectId): Promise<void> {
    try {
        var u1 = await User.findById(user1);
        var u2 = await User.findById(user2);
    } catch (err) {
        Promise.reject(err)
    }
    if (!u1.friends.includes(u2._id)) {
        u1.friends.push(u2.id);
        u2.friends.push(u1.id);
        try {
            await u1.save();
            await u2.save();
        } catch (err) {
            Promise.reject(err)
        }
        return Promise.resolve();
    }
    return Promise.reject('Users are already friends');
}

export async function setUserState(userId: Types.ObjectId, state: UserState): Promise<UserState> {
    try {
        var user: UserInterface = await getUserById(userId);
        user.state = state;
        console.log((userId.toString() + " has changed his State in: " + state).green.bgRed);
        const stateSaved = (await user.save()).state;
        return stateSaved;
    }
    catch (err) {
        throw err;
    }
}




export const User: Model<UserInterface> = getModel();
