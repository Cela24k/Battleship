import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Socket } from 'socket.io';
import { NotificationListenerService } from './notification-listener.service';
//import UserHttpService 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';  
  route = '';

  constructor(private router: Router, private clientSocket: Socket, notificationService: NotificationListenerService   ) {  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.route = this.router.url : null
    })
  }

  navigateRegister(): void{
    this.router.navigate(['/register']);
  }

  navigateLogin(): void{
    this.router.navigate(['/login']);
  }
}
