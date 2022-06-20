import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { SocketioService } from './socketio.service';

@Injectable()
export class NotificationListenerService {

  constructor(private sio: SocketioService) {
  }

  onNewMessage() {
    return this.sio.listen('notification');
  }
}

