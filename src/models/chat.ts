import mongoose, { Document, Model, Schema, Types, SchemaTypes } from "mongoose";

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
    default: () => Date.now()
  },
  text: {
    type: SchemaTypes.ObjectId,
    required: true,
  },
});

export interface ChatInterface extends Document {
  messages: [MessageInterface];
  users: [Types.ObjectId];

  /* add a specific user to the chat */
  addUser(id: Types.ObjectId): void;
  /* remove a specific user from the chat */
  removeUser(id: Types.ObjectId): void;
  /* add a message into the chat*/
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

ChatSchema.methods.addUser = async function (id: Types.ObjectId): Promise<any> {
  if (!this.users.includes(id)) {
    this.users.push(id);
    return await this.save();
  }
  return Promise.reject("UserId: " + id + " is already in the chat or is undefiend");
}

ChatSchema.methods.removeUser = async function (id: Types.ObjectId): Promise<any> {
  if (!this.users.includes(id)) {
    var index = this.users.indexOf(id);
    if (index > -1) {
      this.friends.splice(index, 1);
      return await this.save();
    }
  }
  return Promise.reject("UserId: " + id + " is already removed or is undefiend");
}

ChatSchema.methods.addMessage = async function (sender: Types.ObjectId,text: string): Promise<MessageInterface> {
  const time =  new Date();
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
export function createChat(users: Types.ObjectId[]): ChatInterface{ 
  var chat = new ChatModel({users});
  return chat;
}

export const ChatModel: Model<ChatInterface> = getModel();