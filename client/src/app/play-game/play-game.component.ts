import { Component, OnInit } from '@angular/core';
import { Cell, CellType } from './field/field.component';

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

  constructor() { }

  ngOnInit(): void {
  }

  playRandom(): void {

  }

  isPlaying(): boolean {
    return this.playing;
  }

  drop(event: any) {
    console.log('first')
  }
}
