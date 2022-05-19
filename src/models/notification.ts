import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";

export enum NotificationType {
    Game,
    Friend,
    Others
}

export interface NotificationInterface extends Document{
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
    text: string,
    type: NotificationType,
    expire_time: Date,
    
    /* fa una determinata richiesta in base al tipo di notifica
    *  es. if(NotifiCìcationType === Friend) receiver.addFriend(sender)
    */
    accept(): void;
    
    //rimuove la notifica dal database 
    refuse(): void;

    /* generare il testo della notifica 
    *  User1 + ti ha chiesto + di (Giocare) o (Fare amicizia)
    */
   generateHeader(): void;

}