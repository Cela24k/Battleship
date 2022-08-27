import { Component, EventEmitter, Input, NgModule, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatHttpService } from 'src/app/chat-http.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ChatInterface, emptyChat, emptyMessage, MessageInterface } from '../chat.component';


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit{
  @Input() props: ChatInterface = emptyChat();
  @Output() closeChatEvent = new EventEmitter<ChatInterface>();

  username: string;
  userid: string;
  messages: MessageInterface[];

  constructor(private client: ChatHttpService,private localstorage: LocalStorageService) {
    this.username = ''
    this.userid = localstorage.getId();
    this.messages = []
  }

  ngOnInit(): void {
    this.fetchInfo();
    this.messages = this.props.messages;
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

  sendMessage(txt: string){
    console.log(this.props);
    this.client.sendMessage(txt, this.userid, this.props['_id']).subscribe({
      next: (data)=>{
        this.messages.push(data.chat)
      },
      error: (e)=>{
        console.log(e)
      }
    });
  }
}
