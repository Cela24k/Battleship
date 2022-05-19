import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";

export interface MessageInterface {
    sender: Types.ObjectId;
    time: Date,
    text: string,
}
export const MessageSchema = new Schema<MessageInterface>({
    sender: {
      type: SchemaTypes.String,
      required: true,
    },
    time: {
      type: SchemaTypes.Date,
      required: true,
    },
    text: {
      type: SchemaTypes.ObjectId,
      required: true,
    },
});
  
export interface ChatInterface extends Document{
    messages: [MessageInterface];
    users: [Types.ObjectId];

    /* Idk if this goes here or in User class*/
    writeMessage(text: string ): void;

    /* TODO: other methods*/
}