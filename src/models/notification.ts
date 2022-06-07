import mongoose, { Document, Model, Schema, Types, SchemaTypes } from "mongoose";

export enum NotificationType {
    Game,
    Friend,
    Others
}

export interface NotificationInterface extends Document {
    sender: Object,
    receiver: Object,
    text: string,
    ntype: NotificationType,
    expire_time: Date,

    /* fa una determinata richiesta in base al tipo di notifica
    *  es. if(NotificationType === Friend) receiver.addFriend(sender)
    */
    accept(): void;

    //rimuove la notifica dal database 
    refuse(): void;

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

export function generateHeader(name: string, ntype: NotificationType): Promise<String> {
    if (ntype === NotificationType.Friend)
        return Promise.resolve(name + 'sent you a Friend Notification');
    else if (ntype === NotificationType.Game)
        return Promise.resolve(name = 'invited you to a friendly Match');
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

export function newNotification(sender_name: string, sender: Types.ObjectId, receiver: Types.ObjectId, ntype: NotificationType): NotificationInterface {
    let header = generateHeader(sender_name, ntype).catch(
        (err)=>Promise.reject(err)
    );
    let data = {
        sender,
        receiver,
        ntype,
        text:header,
    }
    const _notificationModel = getModel();
    var notification = new _notificationModel(data);
    return notification;
}

export const Notification: Model<NotificationInterface> = getModel();
