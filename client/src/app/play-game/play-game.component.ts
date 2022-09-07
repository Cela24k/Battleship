import { BattleGrid, Cell, Match, OrientationShip, Ship, ShipLenght } from './game-entities/game';
import { Component, ElementRef, NgModule, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GameService } from '../game.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketioService } from '../socketio.service';
import { LocalStorageService } from '../local-storage.service';

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
  matchmaking: boolean,
  preparation: boolean,
  playing: boolean,
  match: Match | null,
  positions: Ship[];
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

  ships: any[] = [new Ship([], ShipLenght.Carrier, "Carrier", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Battleship, "Battleship", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Cruiser, "Cruiser", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Submarine, "Submarine", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Destroyer, "Destroyer", OrientationShip.Horizontal)]

  constructor(private _snackBar: MatSnackBar,private gameService: GameService, private sio: SocketioService, private ls: LocalStorageService) { }

  ngOnInit(): void {
    this.turnListener();
  }

  //ottenere partite gia esistenti e cambiare il valore di game.preparation a false;
  fetchExistingMatch(): void{
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

  clickEvent(event: any): void{
    const shipType = this.ships.find((e) => {
      return e.type == event.srcElement.innerText;
    })
    this.selected = shipType;
    event.stopPropagation();
  }

  rotateShip(event:any){
    if(this.selected){
      this.isRotated = event.checked ? true : false;
      this.selected.orientation = this.selected.orientation == OrientationShip.Horizontal ? OrientationShip.Vertical : OrientationShip.Horizontal; 
    }
  }

  popShip(ship: Ship){
    const index = this.ships.indexOf(ship)
    if( index != -1){
      this.ships.splice(index,1)
      this.selected = null
      this.isRotated = false;
    }
  }

  addShip(ship: Ship){
    ship.position = [];
    this.ships.push(ship);
    this.isRotated = false;
  }
  
  isHorizontal(){
    return this.selected?.orientation == OrientationShip.Horizontal;
  }

  shotReady(event: any){
    this.shot = event;
  }

  isGameRandom(): boolean{
    return this.game != null && this.game.type == GameType.Random;
  }

  onGameEvent(event: GameType){
    //per ricevere un match esistente
    // if(this.game == null){
    //   this.game = {type: event, preparation: true};
    // }
    this.game = {type: event, matchmaking:true, preparation: false, playing: false, match: null, positions: []};
  }

  isMatchmaking(): boolean {
    return this.game != null && this.game.matchmaking == true;
  }

  isPreparing(): boolean {
    return this.game != null && this.game.preparation == true;
  }

  onMatchEvent(event: Match){
    if(this.game){
      this.game.matchmaking = false;
      this.game.preparation = true;
      this.game.match = event;
    }
  }

  onPositionEvent(event: Ship[]){
    if(this.game){
      this.game.positions = event;
    }
  }

  initBoard(){
    if(this.game && this.game.match && this.game.positions){
      this.gameService.initBoard(this.game.match._id, new BattleGrid([],this.game.positions)).subscribe({
        next: (value)=> {
          if(this.game){
            //ste due righe di codice da fare quando il server emitta che i due giocatori sono pronti
            this.game.preparation = false;
            this.game.playing = true;
            this.openSnackBar('Board initialized, waiting for opponent', 'Got it!')
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

  turnListener(){
    this.sio.listen('match-turn').subscribe({
      next: (value) => {
        console.log(value);
        this.turn = value.gameTurn == this.ls.getId();
      },
      error(err) {
          console.log(err);
      },
      complete() {
          
      },
    })
  }

  formatProps() {
    if(this.game)
      return {shots:[], ships:this.game.positions}
    else
      return {shots: [], ships: []};
  }

  shoot(){
    if(this.game && this.game.match && this.shot){
      this.gameService.shoot(this.game.match._id, this.shot).subscribe({
        next: (value) => {
            this.turn = value.gameTurn == this.ls.getId();
            //sostituire cella con hit o miss 
        },
        error(err) {
            console.log(err)
        },
        complete() {
            
        },
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  winner(){
    return false;
  }

  resetState(){

  }

  isShootEnabled(){
    return this.shot && this.turn;
  }
}
