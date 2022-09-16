import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ChatInterface } from 'src/app/chat/chat.component';
import { GameService } from 'src/app/game.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { SocketioService } from 'src/app/socketio.service';
import { StatsInterface, UserHttpService, UserInterface } from 'src/app/user-http.service';
import { Cell, Match, Ship } from '../game-entities/game';

interface GameSpectate {
  players: string[],
  observers: [],
  timerId: NodeJS.Timeout | null,
  timer: number,
  turn: string,
  playing: boolean,
  match: Match | null,
  positions: Ship[];
  shots: Cell[];
  opponentShots: Cell[];
}

@Component({
  selector: 'app-spectate',
  templateUrl: './spectate.component.html',
  styleUrls: ['./spectate.component.css'],
  host: { 'class': 'flex-wrapper' },
})
export class SpectateComponent implements OnInit {

  onlineFriends: UserInterface[] = [];
  isObserving = false;
  observedGame: any | null = null;
  chat: ChatInterface[] = [];

  constructor(private _snackBar: MatSnackBar, private ls: LocalStorageService, private router: Router, private gameService: GameService, private userhttp: UserHttpService, private sio: SocketioService) {

  }

  ngOnInit(): void {
    this.fetchData();
    this.turnListener();
  }

  fetchData() {
    let users: UserInterface[];
    this.userhttp.getUsers().subscribe({
      next(value) {
        users = value;
      },
      error(err) {
        console.log(err);
      },
      complete: () => {
        let playingUsers: UserInterface[] = [];
        users.forEach((e) => {
          if (e.state == 'Playing')
            playingUsers.push(e);
        })
        this.onlineFriends = playingUsers;
        this.listenOnline();
      },
    })
  }

  listenOnline() {
    this.sio.listen('state-change').subscribe({
      next: (value: any) => {
        if (value.state == "Playing") {
          this.onlineFriends.push({ _id: value.userId, username: value.username, state: value.state, stats: value.stats });
          this.onlineFriends = this.onlineFriends.slice()
        }
        else if (value.state == "Online") {
          let index = null;
          this.onlineFriends.map((user, i) => {
            if (user._id == value.userId) {
              index = i;
            }
          })
          if (index != null) {
            this.onlineFriends.splice(index, 1)
            this.onlineFriends = this.onlineFriends.slice()
          };
        }
      },
      error(err) {
        console.log(err);
      },
    })
  }

  goBack() {
    this.router.navigate(['/play']);
  }

  spectatePlayer(id: string) {
    this.observedGame = {
      playerOneId: '',
      playertwoId: '',
      players: [],
      observers: [],
      turn: '',
      timerId: null,
      timer: 0,
      playing: false,
      match: null,
      positions: [],
      shots: [],
      opponentShots: []
    };
    this.isObserving = true;
    this.gameService.getSpectateMatch(id).subscribe({
      next: (value) => {
        if (this.observedGame) {
          this.observedGame.shots = value.playerOne.board.shots;
          this.observedGame.opponentShots = value.playerTwo.board.shots;
          this.observedGame.turn = value.gameTurn;
          this.observedGame.playerOneId = value.playerOne.userId;
          this.observedGame.playerTwoId = value.playerTwo.userId;
          
          console.log(value);
          this.sio.emit("match-join", { userId: this.ls.getId(), match: value });

        }
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
  turnListener() {

    this.sio.listen('match-turn').subscribe({
      next: (value) => {
      
        if (value.userId == this.observedGame.playerOneId) {
          this.observedGame.shots.push(value.shot);
        } else {
          this.observedGame.opponentShots.push(value.shot);
        }
      },
      error(err) {
        console.log(err);
      },
      complete() {

      },
    })

    this.sio.listen('game-over').subscribe({
      next: (value) => {
        this.gameOver(value);
      },
      error(err) {
        console.log(err);
      },
      complete: () => {
      }
    })

    this.sio.listen('ship-destroyed').subscribe({
      next: (value) => {
        value.ship.position.forEach((e: Cell) => {
          this._snackBar.open(value.ship.type + 'Ship destroyed', 'Close', { duration: 3000 });
          //fare qualcosa
          // let elem = document.getElementById(((e.row*10+e.col)+100).toString());
          // elem?.setAttribute('style','border: 1px solid black');
        });
      },
      error(err) {
        console.log(err);
      },
    })

    this.sio.listen('chat-match').subscribe({
      next: (value: any) => {
        if (value.message.sender == 'Server') {
          this.chat.push(value.message);
        } else {
          this.userhttp.getUserById(value.message.sender).subscribe({
            next: (data: UserInterface) => {
              value.message.sender = data.username;
              this.chat.push(value.message);

            },
            error(err) {
              console.log(err);
            },
          }
          );
        }
      },
      error(err) {
        console.log(err);
      },
    })
  }

  gameOver(value: any) {
    this.userhttp.getUserById(value.matchResult.winner).subscribe({
      next: (value) => {
        this._snackBar.open(value.username + 'won the game', 'Continue')
      },
      error(err) {
        console.log(err);
      },
    })
  }

  stopObserving() {
    this.isObserving = false;
    this.observedGame = null;
  }

  formatProps() {
    return {}
  }

  fieldformatProps() {
    if (this.observedGame)
      return { shots: this.observedGame.opponentShots, ships: [] }
    else
      return { shots: [], ships: [] };
  }

  shotsformatProps() {
    if (this.observedGame)
      return { shots: this.observedGame.shots, ships: [] }
    else
      return { shots: [], ships: [] };
  }


}
