import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import ChatMatchEmitter from "../Emitter/ChatMatchEmitter";
import ios from "../..";
import { setUserState, UserState } from "../../models/user";
export class LogOutListener extends Listener {

    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(client: Socket) {
        super(client, 'log-out');

    }

    listen(): void {
        super.listen(async (data: any) => {//TODO qui si avranno anche le chaiamate al databse
            try{
                await setUserState(data.userId, UserState.Offline);
            }catch(err){
                console.log(err);
            }
        })
    }

}