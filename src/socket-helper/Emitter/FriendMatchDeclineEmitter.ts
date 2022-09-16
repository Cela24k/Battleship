import { Types } from "mongoose";
import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";
class FriendMatchDeclineEmitter<T> extends RoomEmitter<any>{
    
    constructor(ios: Server, roomId: string){
        super(ios, 'friend-decline',roomId);
    }
}

export default FriendMatchDeclineEmitter;