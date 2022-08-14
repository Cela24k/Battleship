import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationHttpService } from '../notification-http.service';
import { NotificationListenerService } from '../notification-listener.service';

enum State {
  Closed,
  Open
}

// vedere come riutilizzare le interfacce del model -> niente, vanno ricopiate

enum NotificationType {
  Game,
  Friend,
  Others
}

export interface NotificationInterface{
  readonly _id: string,
  sender: Object,
  receiver: Object,
  text: string,
  ntype: NotificationType,
  expire_time: Date,
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  status: number;
  n_pending: number;
  stored_notifications: NotificationInterface[];
  socket_notifications: NotificationInterface[];
  
  constructor(private httpservice: NotificationHttpService,private socket: NotificationListenerService) {
    this.status = State.Closed;
    this.n_pending = 0;
    this.stored_notifications = [];
    this.socket_notifications = [];
  }

  ngOnInit(): void {
    this.fetchNotifications();
    this.socket.onNewMessage().subscribe((data)=>{
      this.socket_notifications.push(data);
      this.n_pending++;
    })
  }

  isOpened(): boolean {
    return this.status === State.Open;
  }

  toggleStatus(): void {
    this.status = this.status === State.Closed ? State.Open : State.Closed;
  }

  fetchNotifications(): void {
    this.httpservice.getNotifications().subscribe({
      next: (d) => {
        this.stored_notifications = d;
        this.n_pending = this.stored_notifications.length;
      },
      error: (err) => {
        console.log(err);
        console.log('Error: ' + JSON.stringify(err));
      },
      complete: () => {},
    });
  }
}
