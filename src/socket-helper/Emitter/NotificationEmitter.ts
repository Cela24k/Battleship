import { Server } from "socket.io";
import { RoomEmitter } from "./RoomEmitter";

class NotificationEmitter<T> extends RoomEmitter<any>{
    constructor(ios: Server, roomId: string){
        super(ios,"notification",roomId);
    }

}

export default NotificationEmitter;