import { Injectable } from '@angular/core';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class ChatListenerService {

  constructor(private sio: SocketioService) { }

  onNewMessage() {
    return this.sio.listen('chat-message');
  }
}
