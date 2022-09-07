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
        this.joinMatch();
        this.joinQueue();
      }
    })
  }

  joinMatch() {
    console.log('im listening for matches');
    this.gameSocket.listen('new-match').subscribe({
      next: (data: Match) => {
        console.log(data);
        this.joinedMatchEvent.emit(data);
        this.gameSocket.emit("match-join",{userId: this.ls.getId(), match: data});
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
      }
    })
  }

  joinQueue() {
    console.log('im connected to the queue');
    this.gameService.joinQueue().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {

      }
    });
  }

  onCancel() {
    this.gameService.removeQueue().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {

      }
    })

  }
}
