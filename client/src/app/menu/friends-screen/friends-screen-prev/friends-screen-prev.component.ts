import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';

@Component({
  selector: 'app-friends-screen-prev',
  templateUrl: './friends-screen-prev.component.html',
  styleUrls: ['./friends-screen-prev.component.css']
})
export class FriendsScreenPrevComponent implements OnInit {
  @Input() id: string = '';
  userinfo: UserInterface | null = null;
  @Output() sendNameEvent = new EventEmitter<string>();

  constructor(private httpservice: UserHttpService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.httpservice.getUserById(this.id).subscribe({
      next: (data)=>{
        this.userinfo = data;
      },
      error: (e)=>{
        console.log(e)
      },
      complete: ()=>{
        this.sendNameEvent.emit(this.userinfo?.username)
      } 
    })
  }


}
