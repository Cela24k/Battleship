import { Component, OnInit } from '@angular/core';
import { OrientationShip, ShipLenght } from './game-entities/game';

export enum GameType {
  Friend,
  Random
}

interface SelectedShip {
  type: string,
  length: number,
  orientation: boolean // 0 horizontal, 1 vertical
}

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {
  playing: boolean = false;

  ships = [{
    position: [],
    shipType: ShipLenght.Carrier,
    type: "Carrier",
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Battleship,
    type: "Battleship",
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Cruiser,
    type: "Cruiser",
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Submarine,
    type: "Submarine",
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Destroyer,
    type: "Destroyer",
    orientation: OrientationShip,
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
    console.log(event)
  }
}
