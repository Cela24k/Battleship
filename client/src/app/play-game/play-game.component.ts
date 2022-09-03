import { OrientationShip, ShipLenght } from './game-entities/game';
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
  selected: any | null = null;
  formControl = new FormControl([]);
  isRotated: boolean = false;

  ships: any[] = [{
    position: [],
    length: ShipLenght.Carrier,
    type: "Carrier",
    orientation: OrientationShip.Horizontal,
  }, {
    position: [],
    length: ShipLenght.Battleship,
    type: "Battleship",
    orientation: OrientationShip.Horizontal,
  }, {
    position: [],
    length: ShipLenght.Cruiser,
    type: "Cruiser",
    orientation: OrientationShip.Horizontal,
  }, {
    position: [],
    length: ShipLenght.Submarine,
    type: "Submarine",
    orientation: OrientationShip.Horizontal,
  }, {
    position: [],
    length: ShipLenght.Destroyer,
    type: "Destroyer",
    orientation: OrientationShip.Horizontal,
  }]

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

  clickEvent(event: any) {
    const shipType = this.ships.find((e) => {
      return e.type == event.srcElement.innerText;
    })
    this.selected = shipType;
    event.stopPropagation();
  }

  rotateShip(event:any){
    if(this.selected){
      this.isRotated = event.checked ? true : false;
    }
  }
}
