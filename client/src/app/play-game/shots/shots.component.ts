import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { formatCoords } from '../field/field.component';
import { Cell, CellType } from '../game-entities/game';

const SIZE = 10;

@Component({
  selector: 'app-shots',
  templateUrl: './shots.component.html',
  styleUrls: ['./shots.component.css']
})
export class ShotsComponent implements OnInit {
  @Output() shotReadyEvent = new EventEmitter<Cell>();

  field: Cell[] = [];
  hovered: ElementRef = new ElementRef('');
  selected: Cell | null = null;
  
  constructor() { }

  ngOnInit(): void {
    this.populateField();
  }

  populateField(): void {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        this.field[i * SIZE + j] = new Cell(i, j, CellType.Empty);
      }
    }
  }

  clickHandler(event: any, index: number) {
    const coords = formatCoords(SIZE, index); //[x,y]
    console.log(coords)
    if(this.hovered && this.field[index]){
      if(this.selected)
        this.field[this.selected?.row * SIZE + this.selected.col].cellType = CellType.Empty;
      this.field[index] = new Cell(coords[0],coords[1], CellType.Shot)
      this.selected = this.field[index];
      this.shotReadyEvent.emit(this.selected);
    }
  }

  hoverHandler(event: any, index?: any) {
    const elements: any = [];
    const coords = formatCoords(10, index);

    if (this.field[index].cellType == CellType.Empty) {
      let htmlelem;
      htmlelem = new ElementRef(document.getElementById((parseInt(event.srcElement.id)).toString()));

      if (htmlelem.nativeElement != null) {
        htmlelem.nativeElement?.setAttribute('style', 'background-color: lightcoral');
        this.hovered = htmlelem;
      }
    }
    event.stopPropagation();
  }

  leaveHandler(event: any, index?: any) {
      if (this.hovered.nativeElement != null)
        this.hovered.nativeElement.setAttribute('style', '');
  }

  isEmpty(index: number){
    return this.field[index].cellType == CellType.Empty;
  }
}
