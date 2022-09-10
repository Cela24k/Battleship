import { BattleGrid, Cell, CellType, getAllShips, OrientationShip, Ship } from '../game-entities/game';
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
  @Output() shipsRandomizedEvent = new EventEmitter<Ship[]>();

  field: Cell[] = [];
  hovered: ElementRef[] = [];
  placedShips: Ship[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateField();
    this.placeExistingBoards();
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
  }

  populateShots(): void {
    this.props.shots.forEach((e) => {
      this.field[e.row * SIZE + e.col] = new Cell(e.row, e.col, e.cellType);
    })
  }

  placeExistingBoards(): void {
    this.props.ships.forEach(e => {
      e.position.forEach(element => {
        this.field[element.row * SIZE + element.col] = new Cell(element.row, element.col, CellType.Ship);
      });
    });
  }

  clickHandler(event: any, index: number) {
    const coords = formatCoords(SIZE, index); //[x,y]

    // cliccata una barca 
    if (this.listeners) {
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

        if (shipElement && shipIndex != undefined) {
          shipElement.position.forEach((e) => {
            this.field[e.row * SIZE + e.col] = new Cell(coords[0], coords[1], CellType.Empty);
          })


          this.placedShips.splice(shipIndex, 1);
          this.addShipEvent.emit(shipElement);
        }
      } //cliccata una empty
      else {
        if (!this.isOutBound(coords[0], coords[1]) && !this.isTooClose(coords[0], coords[1]) && !this.isHoveringSomething() && this.selected) {
          this.hovered.forEach((e, i) => {
            if (e != null) {
              if (this.selected?.orientation == OrientationShip.Horizontal) {
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
          if (this.placedShips.length == 5)
            this.positionsEvent.emit(this.placedShips);
        }
      }
    }

  }

  hoverHandler(event: any, index?: any) {
    const elements: any = [];
    const coords = formatCoords(10, index);
    const len = this.selected?.length != undefined ? this.selected.length : 0;

    if (this.listeners) {
      if (this.field[index].cellType == CellType.Empty && !this.isOutBound(coords[0], coords[1]) && !this.isOverlapping(coords[0],coords[1]) && !this.isTooClose(coords[0],coords[1]) ) {
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
    if (this.listeners) {
      this.hovered.forEach((elem) => {
        if (elem.nativeElement != null)
          elem.nativeElement.setAttribute('style', '');
      })
    }
  }

  isEmpty(index: any): boolean {
    return this.field[index].cellType == CellType.Empty;
  }

  isHoveringSomething(): boolean {
    return this.hovered.some((e) => e && this.field[e.nativeElement.id].cellType == CellType.Ship);
  }

  randomizeField() {
    let boats = getAllShips();
    this.placedShips = [];
    this.populateField();

    boats.forEach(elem => {
      let placed = false;
      this.selected = elem;
      while (!placed) {
        let x = Math.floor(Math.random() * 10);
        let y = Math.floor(Math.random() * 10);
        let rot = Math.floor(Math.random()*2);
        this.selected.orientation = rot;
        
        if (this.placeShip(x, y)){
          placed = true;
        }
      }
    })
    this.selected = null;
    this.shipsRandomizedEvent.emit(this.placedShips);
  }

  placeShip(x: number, y: number): boolean {
    if (this.selected && !this.isOutBound(x, y) && !this.isOverlapping(x, y) && !this.isTooClose(x,y)) {
      for (let index = 0; index < this.selected.length; index++) {
        if(this.selected.orientation == OrientationShip.Horizontal){
          this.field[x*SIZE+(index+y)].cellType = CellType.Ship;
          this.selected.position.push(this.field[x*SIZE+(index+y)]);
        }
        else{
          this.field[(x+index)*SIZE+y].cellType = CellType.Ship;
          this.selected.position.push(this.field[(x+index)*SIZE+y]);
        }
      }
      this.placedShips.push(this.selected);
      return true;
    }
    return false;
  }

  isOutBound(x: number, y: number): boolean {
    if (this.selected) {
      if (this.selected.orientation == OrientationShip.Horizontal)
        return y + this.selected.length > SIZE;
      else
        return x + this.selected.length > SIZE;
    }
    return false;
  }

  isOverlapping(x: number, y: number): boolean {
    if (this.selected) {
      if (this.selected.orientation == OrientationShip.Horizontal) {
        for (let index = 0; index < this.selected.length; index++) {
          if (this.field[x * SIZE + y + index].cellType != CellType.Empty)
            return true;
        }
      }
      else {
        for (let index = 0; index < this.selected.length; index++) {
          if (this.field[x * SIZE + y + index * SIZE].cellType != CellType.Empty)
            return true;
        }
      }
    }
    return false;
  }

  isTooClose(x: number, y: number): boolean {
      let retVal = false;
      if (this.selected) {
        let positions = [];
        let startPosition = {}

        for (let index = 0; index < this.selected.length; index++) {
          if(this.selected.orientation == OrientationShip.Horizontal){
            positions.push(this.field[x * SIZE + (y+index)]);
          }
          else
            positions.push(this.field[(x+index) * SIZE + y]);
        }

        positions.forEach((e) => {
          if (
            (this.field[(e.row - 1) * SIZE + (e.col - 1)] && this.field[(e.row - 1) * SIZE + (e.col - 1)].cellType != CellType.Empty) ||
            (this.field[(e.row + 1) * SIZE + (e.col - 1)] && this.field[(e.row + 1) * SIZE + (e.col - 1)].cellType != CellType.Empty) ||
            (this.field[(e.row - 1) * SIZE + (e.col + 1)] && this.field[(e.row - 1) * SIZE + (e.col + 1)].cellType != CellType.Empty) ||
            (this.field[(e.row + 1) * SIZE + (e.col + 1)] && this.field[(e.row + 1) * SIZE + (e.col + 1)].cellType != CellType.Empty)){
              retVal = true;
            }
        })
        if (this.selected.orientation == OrientationShip.Horizontal) {
          if (
            (this.field[x * SIZE + (y + this.selected.length + 1)] &&
            this.field[x * SIZE + (y + this.selected.length + 1)].cellType != CellType.Empty) ||
            (this.field[x * SIZE + (y - 1)] &&
            this.field[x * SIZE + (y - 1)].cellType != CellType.Empty)){
            retVal = true;
          }
        }
        else {
          if (
            (this.field[((x + this.selected.length + 1) * SIZE) + y] &&
            this.field[((x + this.selected.length + 1)* SIZE) + y].cellType != CellType.Empty) ||
            (this.field[((x - 1) * SIZE) + y] &&
            this.field[((x - 1) * SIZE) + y].cellType != CellType.Empty)
          )
            retVal = true;
        }
      }
      return retVal;
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