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
        console.log(data, this.event);
        this.ios.in(this.roomId).emit(this.event, data);
    }


}