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
        // this.joinMatch();
        // this.joinQueue();
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

  // joinMatch() {
  //   console.log('im listening for matches');
  //   this.gameSocket.listen('new-match').subscribe({
  //     next: (data: Match) => {
  //       console.log(data);
  //       // this.joinedMatchEvent.emit(data);
  //       this.gameSocket.emit("match-join",{userId: this.ls.getId(), match: data});
  //     },
  //     error: (e) => {
  //       console.log(e);
  //     },
  //     complete: () => {
  //     }
  //   })
  // }

}