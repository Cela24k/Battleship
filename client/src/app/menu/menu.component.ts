import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatHttpService } from '../chat-http.service';
import { ChatListenerService } from '../chat-listener.service';
import { ChatComponent, ChatInterface, emptyChat } from '../chat/chat.component';

enum State{
  Open,
  Closed
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {

  @Output() openChatEvent = new EventEmitter<ChatInterface>();

  stored_chats : ChatInterface[];
  socket_chats: ChatInterface[];
  n_pending: number;
  state: State;

  constructor(private httpservice: ChatHttpService, private socket: ChatListenerService) {
    this.state = State.Closed;
    this.stored_chats = [];
    this.socket_chats = [];
    this.n_pending = 0;
  }

  ngOnInit(): void {
    this.socket.onNewMessage().subscribe((data)=>{
      console.log(data);
      this.socket_chats.push(data);
      this.n_pending++;
    })
  }

  isOpened(): boolean {
    return this.state === State.Open;
  }

  toggleStatus(): void{
    this.state === State.Open ? this.state = State.Closed : this.state = State.Open;
  }
  
  bridge(chat: ChatInterface){
    this.openChatEvent.emit(chat);
  }

  fetchChats(): void {
    this.httpservice.getChats().subscribe({
      next: (d) => {
        this.stored_chats = d.chats;
        this.n_pending = this.stored_chats.length;
      },
      error: (err) => {
        console.log(err);
        console.log('Error: ' + JSON.stringify(err));
      },
      complete: () => {},
    });
  }
}
