import { Component, OnInit } from '@angular/core';
import { Cell, CellType, OrientationShip, ShipInterface, ShipLenght } from './field/field.component';

export enum GameType {
  Friend,
  Random
}




@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {
  playing: boolean = false;
  ships = ["Carrier",
    "Battleship",
    "Cruiser",
    "Destroyer",
    "Submarine"
  ]
  ship = [{
    position: [],
    shipType: ShipLenght.Carrier,
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Battleship,
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Cruiser,
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Submarine,
    orientation: OrientationShip,
  },{
    position: [],
    shipType: ShipLenght.Destroyer,
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
