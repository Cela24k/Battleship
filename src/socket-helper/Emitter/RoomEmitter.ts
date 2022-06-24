import { Server } from "socket.io";
import { Emitter } from "./Emitter";

//Classe che serve per creare un emitter di stanze
export class RoomEmitter<T> extends Emitter<T>{

    public readonly roomId: string;
    constructor(ios: Server, event: string, roomId: string){
        super(ios,event);
        this.roomId = roomId;
    }


    emit(data: T){
        this.ios.to(this.roomId).emit(this.event, data);
    }


}