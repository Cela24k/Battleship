import { BattleGrid, Cell, CellType } from '../game-entities/game';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

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
  
  @Input() selected: any | null = null;

  field: Cell[] = [];
  hovered: ElementRef[] = [];
  breakpoint: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.populateField();
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 3;
    // sostituire con props veri
    this.props.shots = [ new Cell(3,4,CellType.Hit)]
  }

  populateField(): void {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        this.field[i*length + j] = new Cell(i,j,CellType.Empty);
      }      
    }
  }

  clickHandler(event: any, index: number) {
    console.log(event.target.__ngContext__[0]);
  }

  hoverHandler(event: any, index?: any){
    const elements: any = [];

    console.log('enter');

    for(let i = 0; i < this.selected?.length; i++ ){
      let htmlelem = new ElementRef(document.getElementById((parseInt(event.srcElement.id)+i).toString()))
      htmlelem.nativeElement?.setAttribute('style','background-color: red');
      elements.push(htmlelem);
      console.log((parseInt(event.srcElement.id)+i).toString());
      console.log(document.getElementById((parseInt(event.srcElement.id)+i).toString()));
    }
    this.hovered = elements;
    console.log(this.hovered);
    event.stopPropagation();
  }

  leaveHandler(event: any, index?: any){
    this.hovered.forEach((elem)=>{
      elem.nativeElement.setAttribute('style','');
    })
    console.log('leave');
    console.log((event.target));
  }
  addShot(index: number){
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 3;
  }
}
