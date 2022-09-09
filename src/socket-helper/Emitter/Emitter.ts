import { Server, Socket } from "socket.io";


export class Emitter<T> {

    public readonly ios: Server;
    public readonly event: string;

    constructor(ios: Server, event: string) {
        this.ios = ios;
        this.event = event;
    }

    emit(data: T){
        this.ios.emit(this.event, data);
    }

}