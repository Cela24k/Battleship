import { Component, Input, OnInit } from '@angular/core';
import { ChatHttpService } from 'src/app/chat-http.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ChatInterface } from '../chat.component';

@Component({
  selector: 'app-chat-prev',
  templateUrl: './chat-prev.component.html',
  styleUrls: ['./chat-prev.component.css']
})
export class ChatPrevComponent implements OnInit {
  @Input() props: ChatInterface = {messages:[{sender:"", text:"", time:new Date()}], users:[]};
  username: string; 

  constructor(private client: ChatHttpService, private localstorage: LocalStorageService) {
    this.username = ''
  }

  ngOnInit(): void {
    console.log(this.props);
    this.fetchInfo();
  }

  fetchInfo(): void {
    const friendId = this.props.users[0] === this.localstorage.getId() ? this.props.users[1] : this.props.users[0];
    this.client.getUser(friendId).subscribe({
      next: (data)=>{
        console.log(data);
        this.username = data.username;
      },
      error: (e)=>{
        console.log(e);
      }
    })
  }

}
