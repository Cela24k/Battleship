import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
//TODO sperare e pregare che funzioni.
export class SocketioService {

  public url = "http://localhost:8080";
  private socket: any = null;

  constructor() { }

  connect(event: string): Observable<any> {
    if (this.socket === null) {
      this.socket = io(this.url);
    }

    return new Observable((observer) => {



      this.socket.on(event, (arg: any) => {
        console.log(event.toString);
        observer.next(arg)
      })


      this.socket.on('error', (err: any) => {
        console.log('Socket.io error: ' + err);
        observer.error(err);
      });
    });

  }

  disconnect(){
    if(this.socket === null){
      this.socket.disconnect();
    }
  }

}
