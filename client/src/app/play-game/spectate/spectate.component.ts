import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatInterface } from 'src/app/chat/chat.component';
import { GameService } from 'src/app/game.service';
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
  observedGame: GameSpectate | null = null;
  chat: ChatInterface[] = [];

  constructor(private router: Router, private gameService: GameService, private userhttp: UserHttpService, private sio: SocketioService) { }

  ngOnInit(): void {
    // this.onlineFriends.push({
    //   _id: '629e11b0f044755ee06215d9',
    //   username: 'Cela',
    //   stats: {
    //     wins: 0,
    //     losses: 0,
    //     winstreak: 0,
    //     maxWinstreak: 0,
    //     elo: 0,
    //     playedGames: 0,
    //     shotsFired: 0,
    //     shotsHit: 0,
    //     timePlayed: '',
    //     rank: 0,
    //     _id: '6352r761376568'
    //   },
    //   state: 'Offline'
    // }, {
    //   _id: '629e11b0f044755ee06215d9',
    //   username: 'Cela',
    //   stats: {
    //     wins: 0,
    //     losses: 0,
    //     winstreak: 0,
    //     maxWinstreak: 0,
    //     elo: 0,
    //     playedGames: 0,
    //     shotsFired: 0,
    //     shotsHit: 0,
    //     timePlayed: '',
    //     rank: 0,
    //     _id: '6352r761376568'
    //   },
    //   state: 'Offline'
    // });
    
    this.fetchData();
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
          users.forEach((e)=>{
            if(e.state == 'Playing')
              playingUsers.push(e);
          })
          this.onlineFriends = playingUsers;
          this.listenOnline();
      },
    })
  }

  listenOnline(){
    this.sio.listen('state-change').subscribe({
      next: (value: UserInterface)=> {
        console.log(value);
        if(value.state == 'Online')
          this.onlineFriends.push(value);
        else {
          let index = this.onlineFriends.indexOf(value);
          if(index != -1 )
            this.onlineFriends.splice(index,1);
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

  spectatePlayer(id: number){
    //fare la chiamata poi this.observing = true e game = {}
    this.isObserving = true;
    this.observedGame = {
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
  }

  stopObserving(){
    this.isObserving = false;
    this.observedGame = null;
  }

  formatProps(){
    return {}
  }

  fieldformatProps() {
    if (this.observedGame)
      return { shots: this.observedGame.opponentShots, ships: this.observedGame.positions }
    else
      return { shots: [], ships: [] };
  }

  shotsformatProps() {
    if (this.observedGame)
      return { shots: this.observedGame.shots, ships: this.observedGame.positions }
    else
      return { shots: [], ships: [] };
  }


}
