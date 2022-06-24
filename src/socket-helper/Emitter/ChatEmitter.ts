import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";
//broadcasta un messaggio in una determinata room che sara di valore chatId
class ChatEmitter<T> extends RoomEmitter<any>{
    
    constructor(ios: Server, roomId: string){
        super(ios, 'chat',roomId);
    }

}

export default ChatEmitter;