import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

  playRandom(): void {

  }

  isPlaying(): boolean {
    return this.playing;
  }
}
