import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatHttpService } from '../chat-http.service';
import { ChatListenerService } from '../chat-listener.service';

export interface MessageInterface {
  sender: string;
  time: Date,
  text: string,
}

export interface ChatInterface {
  _id: string;
  messages: MessageInterface[];
  users: string[];
}

export function emptyChat() {
  return { _id:'',messages:[{sender:"", text:"", time:new Date()}], users:[]};
}

export function emptyMessage() {
  return {sender:'', time:new Date(), text:''}
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Output() openChatEvent = new EventEmitter<ChatInterface>();


  n_pending: number;
  stored_chats: ChatInterface[];

  constructor(private httpService: ChatHttpService, private socket: ChatListenerService) { 
    this.stored_chats = [];
    this.n_pending = 0;
  }

  ngOnInit(): void {
    this.fetchChats();
  }

  fetchChats(): void{
    this.httpService.getChats().subscribe({
      next: (d) => {
        console.log(d);
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

  bridge(chat: ChatInterface){
    console.log('bridge');
    this.openChatEvent.emit(chat);
  }
}
