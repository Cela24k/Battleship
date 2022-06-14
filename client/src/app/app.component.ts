import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import io, { Socket } from 'socket.io-client'
import { Observable } from 'rxjs';
import { NotificationListenerService } from './notification-listener.service';
import { SocketioService } from './socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';  
  route = '';
  //client: Socket;

  constructor(
    private router: Router,
    private socket: NotificationListenerService,
    private sio: SocketioService,
    private localStorage: LocalStorageService,
  ) { 
    //this.client = io('http://localhost:8080'); // funziona
    //this.client.on('notification',() =>  console.log('object'));
   }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.route = this.router.url : null
    })
    // this.sio.listen('notification').subscribe((data)=>{
    //   console.log(data);
    // })
    this.socket.onNewMessage().subscribe((data)=>{
      console.log(data);
    })

    this.sio.emit("notification",{mimmo: "el mimmo client"});
    /*//Servizio che fa connessione e tutto in automatico.
    this.socket.onNewMessage().subscribe(() => {
      console.log('got a msg: ');
    });
    */
    // this.sio.listen("mimmetto").subscribe((data)=>{
    //   console.log('qui ci siamo');
    //   console.log(data);
    // })

    // this.sio.emit("mimmetto", "ciao belo");

    
  }

  navigateRegister(): void{
    this.router.navigate(['/register']);
  }

  navigateLogin(): void{
    this.router.navigate(['/login']);
  }

}
