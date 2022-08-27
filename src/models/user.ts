import { Document, Model, Schema, Types, SchemaTypes, SchemaType } from "mongoose";
import mongoose from "mongoose";
import { ChatInterface, ChatModel, ChatSchema } from "./chat";
import { NotificationType, NotificationInterface, newNotification, NotificationSchema } from "./notification";
import * as crypto from "crypto";
import { Stats } from "fs";
import { DeleteResult, UpdateResult } from "mongodb";

export enum Role {
    Mod,
    None
}

export interface UserInterface extends Document {
    username: string,
    email: string,
    digest: string,
    salt: string,
    role: Role,
    friends: Types.ObjectId[], // by reference ?
    stats: StatsInterface,
    notifications: NotificationInterface[],
    playing: boolean,
    chats: Types.ObjectId[],

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
    friendNotification(friend: Types.ObjectId): Promise<boolean>;


    removeNotification(notification: NotificationInterface): Promise<void>;

    /* Sets this User's role */
    setRole(role: Role): void;
    // addChat(): void, // vedere che parametri ha bisogno 
    // removeChat(): void,//stessa cosa

    getUserPublicInfo(): void;

    addChat(chat: ChatInterface): void;

    getChats(): Promise<ChatInterface[]>;

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
    //TODO see if it's worth call just one method to update everystats.
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
        default: 1000,
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


StatsSchema.methods.winsAdd = function (): void {
    this.wins++;
    this.playedGames++;
}

StatsSchema.methods.lossesAdd = function (): void {
    this.losses++;
    this.playedGames++;
}

StatsSchema.methods.winstreakAdd = function (): void {
    this.winstreak++;
    if (this.maxWinstreak < this.winstreak)
        this.maxWinstreak = this.winstreak;
}

StatsSchema.methods.winstreakReset = function (): void {
    this.winstreak = 0;
}

StatsSchema.methods.eloIncrement = function (amount: number): void {
    if (this.elo + amount < 0)
        this.elo = 0;
    else this.elo += amount;
}
StatsSchema.methods.accuracySet = function (): void {
    this.accuracy = this.shotsFired / this.shotsHit;
}
StatsSchema.methods.shotsHitAdd = function (): void {
    this.wins++;
}

// DA QUA IN POI RIVEDERE

StatsSchema.methods.shotsFiredAdd = function (): void {
    this.shotsFired++;
    /*if(the shot hit the target)*/
    this.shotsHitAdd();
    this.accuracySet();
}
StatsSchema.methods.timePlayedAdd = function (amount: Date): void {
    this.timePlayed += amount;
}
StatsSchema.methods.win = function (): void {
    this.winsAdd();
    this.winstreakAdd();
}
StatsSchema.methods.lose = function (): void {
    this.lossesAdd();
    this.winstreakReset();

    this.timePlayedAdd();
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
        default: () => ({}),
    },
    notifications: {
        type: [NotificationSchema],
    },
    playing: {
        type: SchemaTypes.Boolean,
        default: false,
    },
    chats: {
        type: [SchemaTypes.ObjectId],
    }

})

UserSchema.methods.setPassword = function (pwd: string): void {
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
UserSchema.methods.removeFriend = async function (friend: Types.ObjectId): Promise<void> {
    var index = this.friend.indexOf(friend);
    if (index > -1) {
        this.friends.splice(index, 1);
    }
    let res = await this.save().catch(//TODO vedere se e' giusto il modo in cui facciamo la save
        () => Promise.reject('Server Error')
    )
    return Promise.resolve(res);
}

UserSchema.methods.getUserPublicInfo = function (): Object {
    let body = {
        username: this.username,
        friends: this.friendlist,
        stats: this.stats,
        isPlaying: this.playing
    }

    return body;
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

UserSchema.methods.getNotifications = function (): NotificationInterface[] {
    return this.notifications;
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
    }  // TODO need to see how to handle this rejection according to POST request returning state.
    return Promise.resolve();
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
    else return Promise.reject('No user with such Id'); //mettere dentro un errore?
}

export async function getUserById(userid: Types.ObjectId): Promise<UserInterface> {
   
    let result = await User.findById({ _id: userid }).catch(
        (err) => Promise.reject('Server error')
    );
    if (result) return Promise.resolve(result);
    else return Promise.reject('No user with such Id'); //mettere dentro un errore?
}

export async function getAllUsers(): Promise<UserInterface[]> {
    const projection = {
        username: true,
        stats: true,
        playing: true,
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




export const User: Model<UserInterface> = getModel();
