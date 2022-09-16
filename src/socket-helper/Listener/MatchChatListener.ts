import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import ChatEmitter from "../Emitter/ChatMessageEmitter";
import { Listener } from "./Listener";
import ChatMatchEmitter from "../Emitter/ChatMatchEmitter";
import ios from "../..";
export class MatchChatListener extends Listener {

    public readonly chat: Model<ChatInterface>;
    constructor(client: Socket) {
        super(client, 'match-message');

    }

    listen(): void {
        super.listen(async (data: any) => {
            if (data && data.chatId && data.message) {
                const matchChat = new ChatMatchEmitter(ios, data.chatId);
                matchChat.emit({ message: data.message });
            }
        })
    }

}