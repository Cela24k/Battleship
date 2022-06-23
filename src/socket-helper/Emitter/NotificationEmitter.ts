import { Server } from "socket.io";

class NotificationEmitter<T>{
    event: string;
    private ios: Server;
    private receiver: string;
    constructor(ios: Server, receiver: string){
        this.event = 'notification';
        this.ios = ios;
        this.receiver = receiver;
    }

    emit(payload?: T ): void{
        //this.ios.to(this.receiver).emit(this.event);
        this.ios.emit(this.event);
    }
}

export default NotificationEmitter;