import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { ChatComponent, ChatInterface } from '../chat/chat.component';

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

  state: State;

  constructor() {
    this.state = State.Closed;
  }

  ngOnInit(): void {
  }

  isOpened(): boolean {
    return this.state === State.Open;
  }

  toggleStatus(): void{
    this.state === State.Open ? this.state = State.Closed : this.state = State.Open;
  }
  
  bridge(chat: ChatInterface){
    console.log('bridge2');
    this.openChatEvent.emit(chat);
  }
}
