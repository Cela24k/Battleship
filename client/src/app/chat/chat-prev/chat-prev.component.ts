import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatHttpService } from 'src/app/chat-http.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ChatInterface, emptyChat } from '../chat.component';

@Component({
  selector: 'app-chat-prev',
  templateUrl: './chat-prev.component.html',
  styleUrls: ['./chat-prev.component.css']
})
export class ChatPrevComponent implements OnInit {
  @Input() props: ChatInterface = emptyChat();

  @Output() openChatEvent = new EventEmitter<ChatInterface>();

  username: string; 
  openedChats: ChatInterface[];

  constructor(private client: ChatHttpService, private localstorage: LocalStorageService) {
    this.username = ''
    this.openedChats = [];
  }

  ngOnInit(): void {
    this.fetchInfo();
  }

  fetchInfo(): void {
    const friendId = this.props.users[0] === this.localstorage.getId() ? this.props.users[1] : this.props.users[0];
    this.client.getUser(friendId).subscribe({
      next: (data)=>{
        this.username = data.username;
      },
      error: (e)=>{
        console.log(e);
      }
    })
  }

  openChat(){
    // if(!this.openedChats.includes(this.props))
    // {
    //   this.openedChats.push(this.props);
    //   this.openChatEvent.emit(this.props);
    // }
    this.openChatEvent.emit(this.props);
  }

  
  
}
