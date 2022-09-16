import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ChatHttpService } from '../chat-http.service';
import { ChatListenerService } from '../chat-listener.service';
import { ChatComponent, ChatInterface, emptyChat } from '../chat/chat.component';
import { MatDialog } from '@angular/material/dialog';
import { MenuSearchboxComponent } from './menu-searchbox/menu-searchbox.component';
import { UserInterface } from '../user-http.service';
import { LocalStorageService } from '../local-storage.service';

enum State {
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

  stored_chats: ChatInterface[];
  socket_chats: ChatInterface[];
  n_pending: number;
  state: State;
  chatbox: boolean = false;
  friendbox: boolean = false;

  constructor(private httpservice: ChatHttpService, private socket: ChatListenerService, public dialog: MatDialog, private localstorage: LocalStorageService) {
    this.state = State.Closed;
    this.stored_chats = [];
    this.socket_chats = [];
    this.n_pending = 0;
  }

  ngOnInit(): void {
    this.socket.onNewMessage().subscribe((data) => {
      this.n_pending++;
    })

    this.fetchChats();
  }

  isOpened(): boolean {
    return this.state === State.Open;
  }

  toggleStatus(): void {
    this.state === State.Open ? this.state = State.Closed : this.state = State.Open;
  }

  bridge(chat: ChatInterface) {
    this.openChatEvent.emit(chat);
  }

  fetchChats(): void {
    this.httpservice.getChats().subscribe({
      next: (d) => {
        this.stored_chats = d.chats;
        this.n_pending = this.stored_chats.length;
        d.chats.forEach((chat: ChatInterface) => {
          this.socket.joinChat(chat._id);
      });
      },
      error: (err) => {
        console.log('Error: ' + JSON.stringify(err));
      },
      complete: () => { },
    });
  }

  isSearching() {
    return this.chatbox || this.friendbox
  }

  openDialog() {
    const dialogRef = this.dialog.open(MenuSearchboxComponent);
    dialogRef.afterClosed().subscribe(result => {
      let chat = this.stored_chats.find((e)=>{
        if(result)
          return e.users.indexOf(result[0]._id) != -1;
        else 
          return false
      })
      if(!chat) chat = emptyChat();

      chat!.users.push(this.localstorage.getId())
      if (result ) {
        result.forEach((element: UserInterface) => {
          chat!.users.push(element._id);
        });
        this.bridge(chat);
      }
    });
  }

}
