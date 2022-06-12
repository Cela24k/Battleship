import { Injectable } from '@angular/core';
import { Socket } from "socket.io";

export abstract class Listener {
  private client: Socket;
  private room: string;
  private type: string;

  constructor(client: Socket, room: string, type: string) {
    this.client = client;
    this.room = room;
    this.type = type;
  }

  public listen(callback: () => void): void {
    this.client.on(this.type, callback);
  }

  public dispose(): void {
    this.client.removeAllListeners(this.type);
  }
}

@Injectable({
  providedIn: 'root'
})
export class NotificationListenerService extends Listener {
  
  //capire se serve l'id 
  /*
  constructor(client: Socket, room: String) {
    super(client,String(room),'notification');
  }

  public override listen(callback: () => void): void {
    super.listen(callback);
  }
  */
}
