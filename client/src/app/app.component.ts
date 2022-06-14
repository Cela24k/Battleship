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

  constructor(
    private router: Router,
    private socket: NotificationListenerService,
    private localStorage: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.route = this.router.url : null
    })
 
    this.socket.onNewMessage().subscribe((data)=>{
      console.log(data);
    })
  }

  navigateRegister(): void{
    this.router.navigate(['/register']);
  }

  navigateLogin(): void{
    this.router.navigate(['/login']);
  }

}
