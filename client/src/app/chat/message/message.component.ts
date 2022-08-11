import { Component, Input, OnInit } from '@angular/core';
import { ChatInterface } from '../chat.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})


//TODO: bindare in modo i messaggi
export class MessageComponent implements OnInit {
  @Input() props: ChatInterface = {messages:[{sender:"", text:"", time:new Date()}], users:[]};

  constructor() {
   }

  ngOnInit(): void {
  }

}
