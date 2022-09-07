import { Types } from "mongoose";
import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";
//broadcasta un messaggio in una determinata room che sara di valore chatId
class MatchTurnEmitter<T> extends RoomEmitter<any>{
    
    constructor(ios: Server, roomId: string){
        super(ios, 'match-turn',roomId);
    }
}

export default MatchTurnEmitter;