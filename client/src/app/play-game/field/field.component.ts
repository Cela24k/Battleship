import { BattleGrid, Cell, CellType, OrientationShip } from '../game-entities/game';
import { Component, ElementRef, Input, OnInit } from '@angular/core';

const SIZE = 10;

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
  @Input() rotated: boolean = false;

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
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        this.field[i*SIZE + j] = new Cell(i,j,CellType.Empty);
      }      
    }
  }

  clickHandler(event: any, index: number) {
    const coords = this.formatCoords(SIZE,index);
    //console.log(event.target.__ngContext__[0]);
    
    //controllare che nessuna hovered sia sopra una barca

    this.hovered.forEach(e => {
      if(e != null){
        this.field[e.nativeElement.id] = new Cell(coords[0],coords[1], CellType.Ship);
        console.log(e.nativeElement.id)
      }
    });

  }

  hoverHandler(event: any, index?: any){
    const elements: any = [];
    const coords = this.formatCoords(10,index);

    for(let i = 0; i < this.selected?.length; i++ ){
      let htmlelem;
      if(!this.rotated){
        if((coords[1]+i < SIZE))
          htmlelem = new ElementRef(document.getElementById((parseInt(event.srcElement.id)+i).toString()));
        else {
          htmlelem = new ElementRef(document.getElementById('xx'));
        }
      }
      else 
        htmlelem = new ElementRef(document.getElementById((parseInt(event.srcElement.id)+i*10).toString()))

      if(htmlelem.nativeElement != null){
        htmlelem.nativeElement?.setAttribute('style','background-color: lightcoral');
        elements.push(htmlelem);
      }
       
    }

    this.hovered = elements;
    event.stopPropagation();
  }

  leaveHandler(event: any, index?: any){
    this.hovered.forEach((elem)=>{
      if(elem.nativeElement != null)
        elem.nativeElement.setAttribute('style','');
    })
  }

  addBoat(){

  }

  addShot(index: number){
  }

  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 3;
  }

  formatCoords(length: number, index: number): [number, number] {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if(index == i*length+j)
          return [i,j];
      }      
    }
    return [-1,-1];
  }

  isEmpty(index: any){
    return this.field[index].cellType == CellType.Ship
  }
}
