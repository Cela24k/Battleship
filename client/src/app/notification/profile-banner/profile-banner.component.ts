import { Component, Input, OnInit } from '@angular/core';
import { NotificationHttpService } from 'src/app/notification-http.service';
import { NotificationInterface } from '../notification.component';

enum State {
  Accepted,
  Refused,
  None
}

@Component({
  selector: 'app-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.css']
})

export class ProfileBannerComponent implements OnInit {
  @Input('text') text!: string;
  @Input('notification') notification!: NotificationInterface;
  state: State;
  sender: string;

  constructor(private httpservice: NotificationHttpService) {
    this.state = State.None;
    this.sender = '';
  }

  ngOnInit(): void {
    this.sender = this.notification.text.split(' ')[0];
  }

  accept(): void {
    this.httpservice.accept(this.notification._id).subscribe({
      next: (data) => {
        console.log(data);
        this.state = State.Accepted;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  refuse(): void {
    this.httpservice.refuse(this.notification._id).subscribe({
      next: (data) => {
        this.state = State.Refused;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  isNone(): boolean {
    return this.state === State.None;
  }

  isAccepted(): boolean {
    return this.state === State.Accepted;
  }

  isRefused(): boolean {
    return this.state === State.Refused;
  }

}
