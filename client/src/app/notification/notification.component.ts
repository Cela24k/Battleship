import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationHttpService } from '../notification-http.service';
enum State {
  Closed,
  Open
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  status: number;
  n_pending: number;
  stored_notifications: Object[];

  constructor(private httpservice: NotificationHttpService) {
    this.status = State.Closed;
    this.n_pending = 0;
    this.stored_notifications = [];
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  isOpened(): boolean {
    return this.status === State.Open;
  }

  toggleStatus(): void {
    this.status = this.status === State.Closed ? State.Open : State.Closed;
  }

  loadNotifications(): void {
    this.httpservice.getNotifications().subscribe({
      next: (d) => {
        this.stored_notifications = d;
        this.n_pending = this.stored_notifications.length;
        console.log(this.stored_notifications);
      },
      error: (err) => {
        console.log(err);
        console.log('Error: ' + JSON.stringify(err));
      },
      complete: () => {},
    });
  }
}
