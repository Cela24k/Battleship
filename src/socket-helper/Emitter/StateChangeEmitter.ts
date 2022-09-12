import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";

export class StateChangeEmitter<T> extends RoomEmitter<any>{

    constructor(io: Server, roomId: string){
        super(io,"state-change", roomId);
    }
    
}