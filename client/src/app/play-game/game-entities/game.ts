export class Cell {
    public row: number;
    col: number;
    cellType: CellType
    constructor(row: number, col: number, cellType: CellType) {
        this.row = row;
        this.col = col;
        this.cellType = cellType;
    }
}

export enum CellType {
    Empty = 'Empty',
    Hit = 'Hit',
    Miss = 'Miss',
    Ship = 'Ship',
    Shot = 'Shot',
}
export enum OrientationShip {
    Horizontal,
    Vertical
}

export enum ShipLenght {
    Carrier = 5,
    Battleship = 4,
    Cruiser = 3,
    Submarine = 3,
    Destroyer = 2
}

export class Ship {
    position: Cell[];
    length: ShipLenght;
    type: string;
    orientation: OrientationShip;
    constructor(position: Cell[], length: ShipLenght, type: string, orientation: OrientationShip){
        this.position = position;
        this.length = length;
        this.orientation = orientation;
        this.type = type; 

    }
}

export class BattleGrid {
    //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
    //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
    //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
    //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.
    shots: Cell[]; // Shots array for our "grid", the cells have a cellType(see in cell.ts) which helps us for the frontend
    shipsPosition: Ship[];// Ships array that could be studied for the opponent shots.
    constructor(shots: Cell[], shipPositon: Ship[])
    {
        this.shots = shots;
        this.shipsPosition = shipPositon;
    }
}

// if (!this.rotated) {
//     console.log('ciao')
//     this.field[e.nativeElement.id] = new Cell(coords[0], coords[1] + i, CellType.Ship);
//   }
//   else {
//     console.log('ciao2')
//     this.field[e.nativeElement] = new Cell(coords[0] + i, coords[1], CellType.Ship);
//   }