import { Component, EventEmitter, Input, NgModule, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatHttpService } from 'src/app/chat-http.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ChatInterface, emptyChat } from '../chat.component';


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit{
  @Input() props: ChatInterface = emptyChat();
  @Output() closeChatEvent = new EventEmitter<ChatInterface>();

  username: string;

  constructor(private client: ChatHttpService,private localstorage: LocalStorageService) {
    this.username = ''
  }

  ngOnInit(): void {
    this.fetchInfo();
    console.log(this.props)
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

  closeChat(){
    this.closeChatEvent.emit(this.props);
  }
}
