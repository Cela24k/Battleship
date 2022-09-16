import { Server, Socket } from "socket.io";
export abstract class Listener {
    public readonly client: Socket;
    public readonly event: string;

    constructor(client: Socket, event: string) {
        this.client = client;
        this.event = event;
    }

    listen(callback: ((data: any) => void)): void {
        this.client.on(this.event, callback);
    }
}