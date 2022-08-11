import { Component, OnInit } from '@angular/core';
import { ChatHttpService } from '../chat-http.service';
import { ChatListenerService } from '../chat-listener.service';
import { MessageComponent } from "./message/message.component";

interface MessageInterface {
  sender: string;
  time: Date,
  text: string,
}

export interface ChatInterface {
  messages: MessageInterface[];
  users: string[];
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
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
        this.stored_chats = d;
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
