import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import ChatEmitter from "../Emitter/ChatMessageEmitter";
import { Listener } from "./Listener";
import ChatMatchEmitter from "../Emitter/ChatMatchEmitter";
import ios from "../..";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class MatchChatListener extends Listener {

    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(client: Socket) {
        super(client, 'match-message');

    }

    listen(): void {
        super.listen(async (data: any) => {//TODO qui si avranno anche le chaiamate al databse
            if (data && data.chatId && data.message) {
                const matchChat = new ChatMatchEmitter(ios, data.chatId);
                matchChat.emit({ message: data.message });
            }
        })
    }

}