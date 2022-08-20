import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import io, { Socket } from 'socket.io-client'
import { Observable } from 'rxjs';
import { NotificationListenerService } from './notification-listener.service';
import { SocketioService } from './socketio.service';
import { HttpTokenPortingService } from './http-token-porting.service';
import { ChatInterface, emptyChat } from './chat/chat.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';  
  route = '';
  open_chats: ChatInterface [];

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private interceptor: HttpTokenPortingService
  ) { 
    this.open_chats = [];
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      event instanceof NavigationEnd ? this.route = this.router.url : null
    })
  }

  isLoggedIn():boolean {
    return !(this.route === '/login' || this.route ==='/register');
  }
  navigateRegister(): void{
    this.router.navigate(['/register']);
  }

  navigateLogin(): void{
    this.router.navigate(['/login']);
  }

  updateChats(event: ChatInterface){
    this.open_chats.push(event);
  }

  closeChat(chat: ChatInterface){
    const i = this.open_chats.indexOf(chat);
    this.open_chats.splice(i,1);
  }

}
