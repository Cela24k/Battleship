import { BattleGrid, Cell, CellType, OrientationShip, Ship } from '../game-entities/game';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

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
  @Input() selected: Ship | null = null;
  @Input() rotated: boolean = false;

  @Output() popShipEvent = new EventEmitter<Ship>();
  @Output() addShipEvent = new EventEmitter<Ship>();

  field: Cell[] = [];
  hovered: ElementRef[] = [];
  placedShips: Ship[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateField();
    // sostituire con props veri
    this.props.shots = [new Cell(3, 4, CellType.Hit)];
  }

  populateField(): void {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        this.field[i * SIZE + j] = new Cell(i, j, CellType.Empty);
      }
    }
  }

  clickHandler(event: any, index: number) {
    const coords = this.formatCoords(SIZE, index); //[x,y]

    console.log('coordinate: ' + coords);

    // cliccata una barca 
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
        // debugger;
        shipElement.position.forEach((e) => {
          this.field[e.row * SIZE + e.col] = new Cell(e.row, e.col, CellType.Empty);
        })


        this.placedShips.splice(shipIndex, 1);
        console.log(this.placedShips); 
        this.addShipEvent.emit(shipElement);
      }
    } //cliccata una empty
    else {
      if (!this.isHoveringSomething() && this.selected) {
        this.hovered.forEach((e, i) => {
          console.log(e);
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
        console.log(this.placedShips); 
        this.popShipEvent.emit(this.selected);
      }
    }

  }

  hoverHandler(event: any, index?: any) {
    const elements: any = [];
    const coords = this.formatCoords(10, index);
    const len = this.selected?.length != undefined ? this.selected.length : 0;

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

  leaveHandler(event: any, index?: any) {
    this.hovered.forEach((elem) => {
      if (elem.nativeElement != null)
        elem.nativeElement.setAttribute('style', '');
    })
  }

  formatCoords(length: number, index: number): [number, number] {
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        if (index == i * length + j)
          return [i, j];
      }
    }
    return [-1, -1];
  }

  isEmpty(index: any) {
    return this.field[index].cellType == CellType.Ship;
  }

  isHoveringSomething(): boolean {
    return this.hovered.some((e) => e && this.field[e.nativeElement.id].cellType == CellType.Ship);
  }
}
