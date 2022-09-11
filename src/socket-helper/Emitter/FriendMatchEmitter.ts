import { Types } from "mongoose";
import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";
//broadcasta un messaggio in una determinata room che sara di valore chatId
class FriendMatchEmitter<T> extends RoomEmitter<any>{
    
    constructor(ios: Server, roomId: string){
        super(ios, 'friend-match',roomId);
    }
}

export default FriendMatchEmitter;