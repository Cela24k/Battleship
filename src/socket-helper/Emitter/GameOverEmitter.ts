import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";

export class GameOverEmitter<T> extends RoomEmitter<any>{

    constructor(io: Server, roomId: string){
        super(io,"game-over", roomId);
    }
}