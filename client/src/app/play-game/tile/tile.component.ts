import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { CellType } from '../game-entities/game';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input() type: CellType = CellType.Empty;

  constructor() {
  }

  ngOnInit(): void {
  }

  isShot(): boolean {
    return this.type == CellType.Shot;
  }

  isHit(): boolean {
    return this.type == CellType.Hit;
  }

  isMiss(): boolean {
    return this.type == CellType.Miss;
  }

  generateClass(): string {
    if(this.isShot()) return 'tile-shot';
    else if(this.isHit()) return 'tile-hit';
    else if(this.isMiss()) return 'tile-miss';
    return 'tile-shot';
  }
  // generateColor(): string {
  //   return "background-color: "+ 
  // }
}
