import { Component, Input, OnInit } from '@angular/core';

export interface CellInterface{
  row : number,
  col : number,
  cellType : CellType
}

export enum CellType {
  Empty = 'Empty',
  Hit = 'Hit',
  Miss = 'Miss',
  Ship = 'Ship'
}


export enum ShipType {
  Carrier = "Carrier",
  Battleship = "Battleship",
  Cruiser = "Cruiser",
  Destroyer = "Destroyer",
  Submarine = "Submarine",
}

enum ShipLenght {
  Carrier = 5,
  Battleship = 4,
  Cruiser = 3,
  Submarine = 3,
  Destroyer = 2
}

export interface ShipInterface {
  position: CellInterface[];
  length: ShipLenght;
  shipType: ShipType;
}

export interface BattleGrid {
  //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
  //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
  //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
  //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.
  shots: CellInterface[], // Shots array for our "grid", the cells have a cellType(see in cell.ts) which helps us for the frontend
  shipsPosition: ShipInterface[],// Ships array that could be studied for the opponent shots.
}
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

  field = [[]];

  constructor() { }

  ngOnInit(): void {
    this.populateField();
  }

  populateField(): void {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        this.field[i*length + j] = []
      }      
    }
  }

}
