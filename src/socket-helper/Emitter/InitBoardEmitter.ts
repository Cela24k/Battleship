import { Types } from "mongoose";
import { Server } from "socket.io";
import { Emitter } from "./Emitter";

class InitBoardEmitter<T> extends Emitter<any>{
    
    constructor(ios: Server){
        super(ios, 'init');
    }
}

export default InitBoardEmitter;