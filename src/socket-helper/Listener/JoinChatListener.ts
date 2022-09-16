import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import ChatEmitter from "../Emitter/ChatMessageEmitter";
import { Listener } from "./Listener";
export class JoinChatListener extends Listener{

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;
    constructor(client: Socket){
        super(client, 'join-chat');
        
    }

    listen(): void {
        super.listen(async (data: any)=>{
            this.client.join(data.chatId);
        })
    }

}