import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GameType } from '../play-game.component';

@Component({
  selector: 'app-play-game-panel',
  templateUrl: './play-game-panel.component.html',
  styleUrls: ['./play-game-panel.component.css']
})
export class PlayGamePanelComponent implements OnInit {
  @Output() gameEvent = new EventEmitter<GameType>();
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  playRandom(): void {
    this.gameEvent.emit(GameType.Random);
  }

  playFriend(): void {
    this.gameEvent.emit(GameType.Friend);
  }

  spectate(): void {
    this.router.navigate(['/spectate']);
  }
}
