import { Types } from "mongoose";
import { Server } from "socket.io";
import { Emitter } from "./Emitter";
//broadcasta un messaggio in una determinata room che sara di valore chatId
class InitBoardEmitter<T> extends Emitter<any>{
    
    constructor(ios: Server){
        super(ios, 'init');
    }
}

export default InitBoardEmitter;