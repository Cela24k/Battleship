import { Component, Input, OnInit } from '@angular/core';
import { ChatHttpService } from 'src/app/chat-http.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { emptyMessage, MessageInterface } from '../../chat.component';

@Component({
  selector: 'app-message-bubble',
  templateUrl: './message-bubble.component.html',
  styleUrls: ['./message-bubble.component.css']
})
export class MessageBubbleComponent implements OnInit {
  @Input() props: MessageInterface = emptyMessage();
  time : string = '';
  username: string = '';
  userid: string = '';

  constructor(private client: ChatHttpService, private localhelper: LocalStorageService) { }

  ngOnInit(): void {
    this.fetchInfo();
    this.time = this.dateToString();
    this.userid = this.props.sender;
  }

  fetchInfo(): void {
    const userId = this.props.sender;
    this.client.getUser(userId).subscribe({
      next: (data)=>{
        this.username = data.username;
      },
      error: (e)=>{
        console.log(e);
      }
    })
  }

  dateToString(): string {
    const date = new Date(this.props.time).toString().split(' ');
    const response = date[1]+' '+date[2]+' '+date[3]+' '+date[4];
    return response;
  }

  isSelfSent(){
    return this.userid === this.localhelper.getId();
  }
}
