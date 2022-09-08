import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";

export class ShipDestroyedEmitter<T> extends RoomEmitter<any>{

    constructor(io: Server, roomId: string){
        super(io,"ship-destroyed", roomId);
    }
}