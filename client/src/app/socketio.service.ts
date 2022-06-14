import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
//TODO sperare e pregare che funzioni.
export class SocketioService {

  readonly uri = "ws://localhost:8080";
  private socket: any = null;

  constructor() { 
    console.log("costruiamo un nuvo socket");
  }

  listen(eventName: string): Observable<any> {
    if (this.socket === null) {
      this.socket = io(this.uri); 
    }
    
    return new Observable((observer) => {

      this.socket.on(eventName, (data: any) => {
        console.log(eventName);
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
    if (this.socket === null) {
      this.socket.disconnect();
    }
  }

}
