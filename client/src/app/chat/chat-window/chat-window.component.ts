import { DataRowOutlet } from '@angular/cdk/table';
import { Component, ElementRef, EventEmitter, Input, NgModule, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ChatHttpService } from 'src/app/chat-http.service';
import { ChatListenerService } from 'src/app/chat-listener.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { SocketioService } from 'src/app/socketio.service';
import { ChatInterface, emptyChat, emptyMessage, MessageInterface } from '../chat.component';


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;
  @Input() props: ChatInterface = emptyChat();
  @Output() closeChatEvent = new EventEmitter<ChatInterface>();

  username: string;
  userid: string;
  messages: MessageInterface[];

  constructor(private client: ChatHttpService, private localstorage: LocalStorageService, private socket: ChatListenerService, private sio: SocketioService) {
    this.username = ''
    this.userid = localstorage.getId();
    this.messages = [];
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.fetchInfo();
    this.userid = this.localstorage.getId();
    this.messages = this.props.messages;
    this.socket.onNewMessage().subscribe({
      next: (data) => {
        if(data.chatId == this.props._id) //control for message socket
          this.messages.push(data.message);

      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.scrollToBottom();
      }
    })
  }

  ngOnDestroy(): void {
    this.userid = '';
  }

  fetchInfo(): void {
    const friendId = this.props.users[0] === this.localstorage.getId() ? this.props.users[1] : this.props.users[0];
    this.client.getUser(friendId).subscribe({
      next: (data) => {
        this.username = data.username;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  closeChat() {
    this.closeChatEvent.emit(this.props);
  }

  sendMessage(txt: string) {
    const friendId = this.props.users[0] === this.localstorage.getId() ? this.props.users[1] : this.props.users[0];
    this.client.sendMessage(txt, this.userid, this.props['_id'], friendId).subscribe({
      next: (data) => {
        if(this.props._id == ''){
          this.props = data.chat;
          this.socket.joinChat(data.chat._id);
          this.messages = this.props.messages;
        }
      },
      error: (e) => {
        console.log(e)
      }
    });
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer!.nativeElement.scrollTop = this.myScrollContainer!.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
