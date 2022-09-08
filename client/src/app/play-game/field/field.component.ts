import { BattleGrid, Cell, CellType, OrientationShip, Ship } from '../game-entities/game';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

const SIZE = 10;

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {
  @Input() listeners: boolean = false;

  @Input() props: BattleGrid = {
    shots: [],
    ships: []
  };
  @Input() selected: Ship | null = null;
  @Input() rotated: boolean = false;

  @Output() popShipEvent = new EventEmitter<Ship>();
  @Output() addShipEvent = new EventEmitter<Ship>();
  @Output() positionsEvent = new EventEmitter<Ship[]>();
  
  field: Cell[] = [];
  hovered: ElementRef[] = [];
  placedShips: Ship[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateField();
    // sostituire con props veri
    this.populateShots();
  }
  
  ngOnChanges() {
    this.populateShots();
  }

  populateField(): void {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        this.field[i * SIZE + j] = new Cell(i, j, CellType.Empty);
      }
    }
    this.placeExistingBoards();
  }

  populateShots(): void {
    this.props.shots.forEach((e)=>{
      this.field[e.row * SIZE + e.col] = new Cell(e.row,e.col,e.cellType);
    })
  }

  placeExistingBoards(){
    this.props.ships.forEach(e => {
      e.position.forEach(element => {
        this.field[element.row * SIZE + element.col] = new Cell(element.row, element.col, CellType.Ship);
      });
    });
  }

  clickHandler(event: any, index: number) {
    const coords = formatCoords(SIZE, index); //[x,y]

    // cliccata una barca 
    if(this.listeners){
      if (this.field[index].cellType == CellType.Ship) {
        let shipElement: Ship = new Ship([], 0, '', 0);
        let shipIndex = undefined;
        this.placedShips.forEach((e: Ship, i) => {
          let result = e.position.find((x) => {
            return x.row == coords[0] && x.col == coords[1];
          })
          if (result) {
            shipIndex = i;
            shipElement = e;
          }
        });
  
        if(shipElement && shipIndex != undefined){
          shipElement.position.forEach((e)=>{
            this.field[e.row * SIZE + e.col] = new Cell(coords[0], coords[1], CellType.Empty);
          })
  
  
          this.placedShips.splice(shipIndex, 1);
          this.addShipEvent.emit(shipElement);
        }
      } //cliccata una empty
      else {
        if (!this.isHoveringSomething() && this.selected) {
          this.hovered.forEach((e, i) => {
            if (e != null) {
              if (this.selected?.orientation == OrientationShip.Horizontal){
                this.field[e.nativeElement.id] = new Cell(coords[0], coords[1] + i, CellType.Ship);
              }
              else {
                this.field[e.nativeElement.id] = new Cell(coords[0] + i, coords[1], CellType.Ship);
              }
  
              if (this.selected)
                this.selected.position.push(this.field[e.nativeElement.id]);
            }
            else console.log('e null')
          });
          this.placedShips.push(this.selected);
          // mandare emitter di poppare la nave dalla lista
          this.popShipEvent.emit(this.selected);
          if(this.placedShips.length == 5)
            this.positionsEvent.emit(this.placedShips)
        }
      }
    }

  }

  hoverHandler(event: any, index?: any) {
    const elements: any = [];
    const coords = formatCoords(10, index);
    const len = this.selected?.length != undefined ? this.selected.length : 0;
    
    if(this.listeners){
      if (this.field[index].cellType == CellType.Empty) {
        for (let i = 0; i < len; i++) {
          let htmlelem;
          if (this.selected?.orientation == OrientationShip.Horizontal) {
            if ((coords[1] + i < SIZE))
              htmlelem = new ElementRef(document.getElementById((parseInt(event.srcElement.id) + i).toString()));
            else {
              htmlelem = new ElementRef(document.getElementById('xx'));
            }
          }
          else
            htmlelem = new ElementRef(document.getElementById((parseInt(event.srcElement.id) + i * 10).toString()))
  
          if (htmlelem.nativeElement != null) {
            htmlelem.nativeElement?.setAttribute('style', 'background-color: lightcoral');
            elements.push(htmlelem);
          }
        }
      }
  
      this.hovered = elements;
      event.stopPropagation();
    }
  }

  leaveHandler(event: any, index?: any) {
    if(this.listeners){
      this.hovered.forEach((elem) => {
        if (elem.nativeElement != null)
          elem.nativeElement.setAttribute('style', '');
      })
    }
  }

  isEmpty(index: any) {
    return this.field[index].cellType == CellType.Empty;
  }

  isHoveringSomething(): boolean {
    return this.hovered.some((e) => e && this.field[e.nativeElement.id].cellType == CellType.Ship);
  }
}

export function formatCoords(length: number, index: number): [number, number] {
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (index == i * length + j)
        return [i, j];
    }
  }
  return [-1, -1];
}