import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NotificationHttpService } from '../notification-http.service';
enum State  {
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

  constructor(private httpservice: NotificationHttpService) {
    this.status = State.Closed;
    this.n_pending = 1;
  }

  ngOnInit(): void {
  }

  isOpened(): boolean{
    return this.status === State.Open;
  }

  toggleStatus(): void {
    this.status = this.status === State.Closed ? State.Open : State.Closed;
    if(this.status === State.Open)
    {
      this.httpservice.getNotifications();
      console.log('object');
    }  
  }
  
  getNotifications(): void {
    
  }
}
