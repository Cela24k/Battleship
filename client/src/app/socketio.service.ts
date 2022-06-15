import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
//TODO sperare e pregare che funzioni.
export class SocketioService {

  readonly uri = "ws://localhost:8080";
  private socket: Socket;

  constructor() {
    this.socket = io(this.uri);
  }

  listen(eventName: string): Observable<any> {
    
    return new Observable((observer) => {

      this.socket.on(eventName, (data: any) => {
        console.log('Socket listening to '+eventName);
        observer.next(data);
      })

      this.socket.on('error', (err: any) => {
        console.log('Socket.io error: ' + err);
        observer.error(err);
      });
    });

  }

  emit(eventName: string, data: any) {
    
    this.socket.emit(eventName, data);

  }

  disconnect() {
    
    this.socket.disconnect();
    
  }

}
