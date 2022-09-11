import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import ChatMatchEmitter from "../Emitter/ChatMatchEmitter";
import ios from "../..";
import FriendMatchEmitter from "../Emitter/FriendMatchEmitter";
export class FrienMatchListener extends Listener {

    constructor(client: Socket) {
        super(client, 'friend-match');

    }

    listen(): void {
        super.listen(async (data: any) => {
            if(data.friendId && data.userId){
                const friendMatch = new FriendMatchEmitter(ios, data.friendId);
                friendMatch.emit({userId: data.userId});
            }
        })
    }

}