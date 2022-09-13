import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameService } from 'src/app/game.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { SocketioService } from 'src/app/socketio.service';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';
import { Match } from '../game-entities/game';

@Component({
  selector: 'app-matchmaking',
  templateUrl: './matchmaking.component.html',
  styleUrls: ['./matchmaking.component.css']
})
export class MatchmakingComponent implements OnInit {
  @Output() joinedMatchEvent = new EventEmitter<Match>();
  @Output() queueLeftEvent = new EventEmitter<any>();

  name: string = '';


  constructor(private httpservice: UserHttpService, private gameSocket: SocketioService, private gameService: GameService, private ls:LocalStorageService) { }

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
        this.joinQueue();
      }
    })
  }



  joinQueue() {
    this.gameService.joinQueue().subscribe({
      next: (data) => {
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {

      }
    });
  }

  leaveQueue() {
    this.gameService.removeQueue().subscribe({
      next: (data) => {
        this.queueLeftEvent.emit(null);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {

      }
    })
  }

}
