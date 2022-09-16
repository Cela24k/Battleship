import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LocalStorageService } from 'src/app/local-storage.service';
import { SocketioService } from 'src/app/socketio.service';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';
import { Match } from '../game-entities/game';

@Component({
  selector: 'app-waiting-friend',
  templateUrl: './waiting-friend.component.html',
  styleUrls: ['./waiting-friend.component.css']
})
export class WaitingFriendComponent implements OnInit {
  @Input() friendId: string = ' ';
  @Output() joinedMatchEvent = new EventEmitter<Match>();
  
  friendName: string = '';
  name = '';
  
  constructor(private httpservice: UserHttpService, private gameSocket: SocketioService, private ls: LocalStorageService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.httpservice.getMe().subscribe({
      next: (data: UserInterface) => {
        this.name = data.username;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
    
      }
    })

    if(this.friendId)
      this.httpservice.getUserById(this.friendId).subscribe({
        next: (data: UserInterface) => {
          this.friendName = data.username;
        },
        error: (e) => {
          console.log(e);
        },
      })
  }


}
