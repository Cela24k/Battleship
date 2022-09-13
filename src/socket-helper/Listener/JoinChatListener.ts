import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import ChatEmitter from "../Emitter/ChatMessageEmitter";
import { Listener } from "./Listener";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class JoinChatListener extends Listener{

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(client: Socket){
        super(client, 'join-chat');
        
    }

    listen(): void {
        super.listen(async (data: any)=>{//TODO qui si avranno anche le chaiamate al databse
            this.client.join(data.chatId);
        })
    }

}