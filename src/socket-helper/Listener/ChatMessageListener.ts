import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import ChatEmitter from "../Emitter/ChatEmitter";
import { Listener } from "./Listener";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class ChatMessageListener extends Listener{

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(ios: Server, client: Socket){
        super(client, 'chat-message');
        this.ios = ios;
    }

    listen(): void {
        super.listen(async (data)=>{//TODO qui si avranno anche le chaiamate al databse
            var chatEmitter = new ChatEmitter(this.ios,data.roomId);
            
        })
    }

}