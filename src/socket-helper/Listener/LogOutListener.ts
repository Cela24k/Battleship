import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import ChatMatchEmitter from "../Emitter/ChatMatchEmitter";
import ios from "../..";
import { setUserState, UserState } from "../../models/user";
export class LogOutListener extends Listener {

    public readonly chat: Model<ChatInterface>;
    constructor(client: Socket) {
        super(client, 'log-out');

    }

    listen(): void {
        super.listen(async (data: any) => {
            try{
                await setUserState(data.userId, UserState.Offline);
            }catch(err){
                console.log(err);
            }
        })
    }

}