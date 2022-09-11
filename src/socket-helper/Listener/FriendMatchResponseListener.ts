import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import ChatMatchEmitter from "../Emitter/ChatMatchEmitter";
import ios from "../..";
import FriendMatchEmitter from "../Emitter/FriendMatchEmitter";
import { newMatch } from "../../models/match/match";
import NewMatchEmitter from "../Emitter/NewMatchEmitter";
import FriendMatchDeclineEmitter from "../Emitter/FriendMatchDeclineEmitter";
export class FriendMatchResponseListener extends Listener {

    constructor(client: Socket) {
        super(client, 'friend-response');

    }

    listen(): void {
        super.listen(async (data: any) => {//TODO qui si avranno anche le chaiamate al databse
            const userId =data.userId;
            const friendId =data.friendId;
            if (data.accept) {
                const match = await newMatch(userId, friendId)
                const emitterOne = new NewMatchEmitter<any>(ios, userId);
                const emitterTwo = new NewMatchEmitter<any>(ios, friendId);
                emitterOne.emit(match);
                emitterTwo.emit(match);
            }else{
                const emitter  = new FriendMatchDeclineEmitter(ios, friendId);
                emitter.emit({});
            }
        })
    }

}