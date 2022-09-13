import mongoose, { Document, Model, Schema, Types, SchemaTypes } from "mongoose";

export interface MessageInterface {
    sender: Types.ObjectId;
    time: Date,
    text: string,
}

export const MessageSchema = new Schema<MessageInterface>({
    sender: {
        type: SchemaTypes.ObjectId,
        required: true,
    },
    time: {
        type: SchemaTypes.Date,
        default: () => Date.now()
    },
    text: {
        type: SchemaTypes.String,
        required: true,
    },
});

export interface ChatInterface extends Document {
    readonly _id: Types.ObjectId,
    messages: MessageInterface[];
    users: Types.ObjectId[];

    /* add a specific user to the chat */

    addMessage(sender: Types.ObjectId, text: string): Promise<MessageInterface>;

    /* TODO: other methods*/
}


export const ChatSchema = new Schema<ChatInterface>({
    messages: {
        type: [MessageSchema],
    },
    users: {
        type: [Types.ObjectId]
    }
})


ChatSchema.methods.addMessage = async function (sender: Types.ObjectId, text: string): Promise<MessageInterface> {
    const time = new Date();
    var message: MessageInterface = {
        sender,
        text,
        time
    }
    this.messages.push(message);
    await this.save();
    return Promise.resolve(message);
}


export function getSchema() { return ChatSchema; }


var chatModel;  // This is not exposed outside the model
export function getModel(): Model<ChatInterface> { // Return Model as singleton
    if (!chatModel) {
        chatModel = mongoose.model('Chat', getSchema());
    }
    return chatModel;
}
export function createChat(users: Types.ObjectId[], text?: string): Promise<ChatInterface> {
    if (text) {
        var messages: MessageInterface[] = [{ sender: users[0], text, time: new Date() }]
    }

    var chat = new ChatModel({ users, messages: messages! });
    return chat.save();
}

export const ChatModel: Model<ChatInterface> = getModel();