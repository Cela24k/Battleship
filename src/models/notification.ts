import mongoose, { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { makeFriendship, User } from "./user";

export enum NotificationType {
    Game,
    Friend,
    Others
}

export interface NotificationInterface{
    readonly _id: Types.ObjectId,
    sender: Object,
    receiver: Object,
    text: string,
    ntype: NotificationType,
    expire_time: Date,

    /* fa una determinata richiesta in base al tipo di notifica
    *  es. if(NotificationType === Friend) receiver.addFriend(sender)
    */
    accept(): void;

    /* generare il testo della notifica 
    *  User1 + ti ha chiesto + di (Giocare) o (Fare amicizia)
    */
    generateHeader(type: NotificationType): string;

}

export const NotificationSchema = new Schema<NotificationInterface>({
    sender: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    receiver: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    text: {
        type: SchemaTypes.String,
        default: " "
    },
    ntype: {
        type: SchemaTypes.Number,
    },
    expire_time: {
        type: SchemaTypes.Date,
        default: new Date(0)
    },

})

NotificationSchema.methods.accept = async function(): Promise<void> {
    const myid = this.id;
    if(this.ntype === NotificationType.Friend){
        await makeFriendship(this.sender,this.receiver).catch(
            (err) => Promise.reject(err)
        );
        return Promise.resolve();
    }
    else if(this.ntype === NotificationType.Game){
        
        //DO SOMETHING ELSE

    }
    else return Promise.reject('Wrong notification type')
}

export function generateHeader(name: string, ntype: NotificationType): Promise<String> {
    if (ntype === NotificationType.Friend)
        return Promise.resolve(name + ' sent you a Friend Notification');
    else if (ntype === NotificationType.Game)
        return Promise.resolve(name + ' invited you to a friendly Match');
    else
        return Promise.reject('Wrong Notification type');
}

var notificationModel;

export function getSchema() { return NotificationSchema; }

export function getModel(): Model<NotificationInterface> { // Return Model as singleton
    if (!notificationModel) {
        notificationModel = mongoose.model('Notification', getSchema())
    }
    return notificationModel;
}

export async function newNotification(sender_name: string, sender: Types.ObjectId, receiver: Types.ObjectId, ntype: NotificationType): Promise<NotificationInterface> {
    let header = await generateHeader(sender_name, ntype).catch(
        (err)=>Promise.reject(err)
    );
    let data = {
        sender,
        receiver,
        ntype,
        text:header,
    }
    var notification = new Notification(data);
    return Promise.resolve(notification);
}

export async function deleteNotification(nid: Types.ObjectId): Promise<void>{
    await Notification.deleteOne({_id:nid}).catch(
        (err)=>Promise.reject('Server Error')
    )
    Promise.resolve()
}
export const Notification: Model<NotificationInterface> = getModel();
