import { Component, EventEmitter, Input, NgModule, OnDestroy, OnInit, Output } from '@angular/core';
import { ChatInterface, emptyChat } from '../chat.component';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit{
  @Input() props: ChatInterface = emptyChat();
  @Output() closeChatEvent = new EventEmitter<ChatInterface>();

  constructor() {
  }

  ngOnInit(): void {
  }

  closeChat(){
    this.closeChatEvent.emit(this.props);
  }
}
