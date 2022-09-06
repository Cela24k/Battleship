import { OrientationShip, Ship, ShipLenght } from './game-entities/game';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

export enum GameType {
  Friend,
  Random
}

interface SelectedShip {
  position: [],
  length: ShipLenght,
  type: string,
  orientation: OrientationShip // 0 horizontal, 1 vertical
}

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {
  playing: boolean = false;
  selected: Ship | null = null;
  formControl = new FormControl([]);
  isRotated: boolean = false;

  ships: any[] = [new Ship([], ShipLenght.Carrier, "Carrier", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Battleship, "Battleship", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Cruiser, "Cruiser", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Submarine, "Submarine", OrientationShip.Horizontal),
  new Ship([], ShipLenght.Destroyer, "Destroyer", OrientationShip.Horizontal)]

  constructor() { }

  ngOnInit(): void {
  }

  playRandom(): void {

  }

  isPlaying(): boolean {
    return this.playing;
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
    console.log(this.ships);
  }

  addShip(ship: Ship){
    ship.position = [];
    this.ships.push(ship);
    this.isRotated = false;
    console.log(this.ships);
  }
  
  isHorizontal(){
    return this.selected?.orientation == OrientationShip.Horizontal;
  }
}
