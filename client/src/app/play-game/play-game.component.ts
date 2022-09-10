import { BattleGrid, Cell, Match, OrientationShip, Ship, ShipLenght } from './game-entities/game';
import { Component, ElementRef, NgModule, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GameService } from '../game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketioService } from '../socketio.service';
import { LocalStorageService } from '../local-storage.service';
import { UserHttpService, UserInterface } from '../user-http.service';
import { MatDialog } from '@angular/material/dialog';

export enum GameType {
  Friend,
  Random,
  Spectate
}

interface SelectedShip {
  position: [],
  length: ShipLenght,
  type: string,
  orientation: OrientationShip // 0 horizontal, 1 vertical
}

interface Game {
  type: GameType,
  players: string[],
  isChoosingFriend: boolean,
  matchmaking: boolean,
  preparation: boolean,
  playing: boolean,
  match: Match | null,
  positions: Ship[];
  shots: Cell[];
  oppentShots: Cell[];
}

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  turn: boolean | null = null;
  game: Game | null = null;
  selected: Ship | null = null;
  formControl = new FormControl([]);
  isRotated: boolean = false;
  shot: Cell | null = null;
  chatId: string = " ";
  chat: any[] = [];
  text: string = " ";
  audio: HTMLAudioElement = new Audio();
  playerWinner: string = '';

  ships: any[] = [new Ship([], ShipLenght.Carrier, "Carrier", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Battleship, "Battleship", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Cruiser, "Cruiser", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Submarine, "Submarine", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Destroyer, "Destroyer", OrientationShip.Horizontal)]

  constructor(private _snackBar: MatSnackBar, private gameService: GameService, private sio: SocketioService, private ls: LocalStorageService, private userHttp: UserHttpService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.turnListener();
    this.sio.emit("user-join", this.ls.getId());
  }

  //ottenere partite gia esistenti e cambiare il valore di game.preparation a false;
  fetchExistingMatch(): void {
  }

  isPlaying(): boolean {
    return this.game != null;
  }

  drop(event: any) {
    if (event && event.isPointerOverContainer == true) {
      const temp = this.ships[event.previousIndex];
      this.ships[event.previousIndex] = this.ships[event.currentIndex];
      this.ships[event.currentIndex] = temp;
    }
    else {
      let ref = new ElementRef(document.elementFromPoint(event.dropPoint.x, event.dropPoint.y));
      let element: HTMLElement = ref.nativeElement as HTMLElement;
      element.click();
    }
  }

  clickEvent(event: any): void {
    const shipType = this.ships.find((e) => {
      return e.type == event.srcElement.innerText;
    })
    this.selected = shipType;
    event.stopPropagation();
  }

  rotateShip(event: any) {
    if (this.selected) {
      this.isRotated = event.checked ? true : false;
      this.selected.orientation = this.selected.orientation == OrientationShip.Horizontal ? OrientationShip.Vertical : OrientationShip.Horizontal;
    }
  }

  popShip(ship: Ship) {
    const index = this.ships.indexOf(ship)
    if (index != -1) {
      this.ships.splice(index, 1)
      this.selected = null
      this.isRotated = false;
    }
  }

  addShip(ship: Ship) {
    ship.position = [];
    this.ships.push(ship);
    this.isRotated = false;
  }

  isHorizontal() {
    return this.selected?.orientation == OrientationShip.Horizontal;
  }

  shotReady(event: any) {
    this.shot = event;
  }

  isGameRandom(): boolean {
    return this.game != null && this.game.type == GameType.Random;
  }

  onGameEvent(event: GameType) {
    if (event == GameType.Random)
      this.game = { type: event, matchmaking: true, players: [], isChoosingFriend: false, preparation: false, playing: false, match: null, positions: [], shots: [], oppentShots: [] };
    else if (event == GameType.Friend)
      this.game = { type: event, matchmaking: false, players: [], isChoosingFriend: true, preparation: false, playing: false, match: null, positions: [], shots: [], oppentShots: [] };
    else if (event == GameType.Spectate)
      this.game = { type: event, matchmaking: false, players: [], isChoosingFriend: true, preparation: false, playing: false, match: null, positions: [], shots: [], oppentShots: [] };

  }

  isMatchmaking(): boolean {
    return this.game != null && this.game.matchmaking == true;
  }

  isPreparing(): boolean {
    return this.game != null && this.game.preparation == true;
  }

  isChoosingFriend(): boolean {
    return this.game != null && this.game.isChoosingFriend;
  }

  onMatchEvent(event: Match) {
    if (this.game) {
      this.game.matchmaking = false;
      this.game.preparation = true;
      this.game.match = event;
      this.chatId = event.playersChat;
      this.game.players.push(event.playerOne.userId);
      this.game.players.push(event.playerTwo.userId);
    }
  }

  onPositionEvent(event: Ship[]) {
    if (this.game) {
      this.game.positions = event;
    }
  }

  onFriendChosen(event: string) {
    if (event == '') {
      this.resetState();
    }
    if (this.game) {
      this.game.isChoosingFriend = false;
      this.game.playing = true;
    }
  }

  initBoard() {
    if (this.game && this.game.match && this.game.positions) {
      this.gameService.initBoard(this.game.match._id, new BattleGrid([], this.game.positions)).subscribe({
        next: (value) => {
          if (this.game) {
            //ste due righe di codice da fare quando il server emitta che i due giocatori sono pronti
            this.game.preparation = false;
            this.game.playing = true;
            this.openSnackBar('Board succesfully initialized', 'Got it!')
            this.playSound();
          }
        },
        error(err) {
          console.log('bad positions')
        },
        complete() {
        },
      })
    }
  }

  sendMessage() {
    console.log(this.text);
    console.log(this.chatId);
    if (this.text != " ") {
      this.sio.emit('match-message', { chatId: this.chatId, message: { sender: this.ls.getId(), text: this.text, timestamp: Date.now() } })
      this.text = " ";
    }
  }

  turnListener() {
    const myId = this.ls.getId();

    

    this.sio.listen('match-turn').subscribe({
      next: (value) => {
        this.turn = value.gameTurn == myId;
        if (value.shot && value.userId != myId) {
          this.game?.oppentShots.push(value.shot);
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
        console.log(value);
      },
      error(err) {
        console.log(err);
      },
    })


    this.sio.listen('chat-match').subscribe({
      next: (value: any) => {
        console.log("arrivato il messaggio miiiinghia");
        this.userHttp.getUserById(value.message.sender).subscribe({
          next: (data: UserInterface) => {
            value.message.sender = data.username;
            this.chat.push(value.message);

          },
          error(err) {
            console.log(err);
          },
        }
        );
      },
      error(err) {
        console.log(err);
      },
    })
  }

  gameOver(value: any) {
    this.sio.emit("match-left", {match: this.game?.match, userId: this.ls.getId()});
    this.sio.removeListener("chat-match");
    this.sio.removeListener("ship-destroyed");
    this.sio.removeListener("game-over");
    this.stopAudio();
    this.userHttp.getUserById(value.matchResult.winner).subscribe({
      next: (value) => {
        this.playerWinner = value.username;
      },
      error(err) {
        console.log(err);
      },
    })
  }

  fieldformatProps() {
    if (this.game)
      return { shots: this.game.oppentShots, ships: this.game.positions }
    else
      return { shots: [], ships: [] };
  }

  shotsformatProps() {
    if (this.game)
      return { shots: this.game.shots, ships: this.game.positions }
    else
      return { shots: [], ships: [] };
  }

  shoot() {
    if (this.game && this.game.match && this.shot) {
      this.gameService.shoot(this.game.match._id, this.shot).subscribe({
        next: (value) => {
          //sostituire cella con hit o miss 
          if (this.game && this.shot && value[0]) {
            this.game.shots.push(value[0]);
            console.log(this.game.shots);
          }

        },
        error(err) {
          console.log(err);
        },
        complete() {

        },
      })
    }
  }
  playSound() {
    this.audio.src = "../../assets/sound.mp3";
    this.audio.load();
    this.audio.play();
    this.audio.volume = 0.1;
  }

  stopAudio() {
    this.audio.pause();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, { duration: 4000 });
  }

  winner() {
    return this.playerWinner && this.playerWinner.length > 0;
  }

  resetState() {
    this.turn = null;
    this.game = null;
    this.selected = null;
    this.formControl = new FormControl([]);
    this.isRotated = false;
    this.shot = null;
    this.playerWinner = '';

    this.ships = [new Ship([], ShipLenght.Carrier, "Carrier", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Battleship, "Battleship", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Cruiser, "Cruiser", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Submarine, "Submarine", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Destroyer, "Destroyer", OrientationShip.Horizontal)]
  }

  isShootEnabled() {
    return this.shot && this.turn;
  }

  isObserver() {
    if (this.game)
      return this.game.players.indexOf(this.ls.getId()) == -1;
    else
      return false;
  }
}
