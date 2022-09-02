import { Component, Input, OnInit } from '@angular/core';
import { BattleGrid, Cell, CellType } from '../game-entities/game';


const length = 10;

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() props: BattleGrid = {
    shots: [],
    shipsPosition: []
  };

  field: Cell[] = [];

  constructor() {}

  ngOnInit(): void {
    this.populateField();
    // sostituire con props veri
    this.props.shots = [ {row: 3, col: 4, cellType: CellType.Empty}]
  }

  populateField(): void {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        this.field[i*length + j] = {row: i, col: j, cellType: CellType.Empty};
      }      
    }
  }


  addShot(index: number){
  }


}
