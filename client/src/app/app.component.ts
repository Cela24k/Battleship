import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Socket } from 'socket.io';
import { NotificationListenerService } from './notification-listener.service';
import { LocalStorageService } from './local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';  
  route = '';

  constructor(
    private router: Router,
    private clientSocket: Socket, 
    //private notificationService: NotificationListenerService, 
    private localStorage: LocalStorageService
  ) {  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.route = this.router.url : null
    })

    //connettere il socket alla stanza
    this.clientSocket.on('connection',(socket)=>{
      socket.join(this.localStorage.get('jwt'));
    })
  }

  navigateRegister(): void{
    this.router.navigate(['/register']);
  }

  navigateLogin(): void{
    this.router.navigate(['/login']);
  }

  notificationListener(): void{
    //this.notificationService.listen( () => alert('Arrivata nuova notifica') );
  }
}
