import { ChatInterface, emptyChat } from "src/app/chat/chat.component";

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
    constructor(position: Cell[], length: ShipLenght, type: string, orientation: OrientationShip) {
        this.position = position;
        this.length = length;
        this.orientation = orientation;
        this.type = type;

    }
}

export class BattleGrid {
    shots: Cell[]; // Shots array for our "grid", the cells have a cellType(see in cell.ts) which helps us for the frontend
    ships: Ship[];// Ships array that could be studied for the opponent shots.
    constructor(shots?: Cell[], ships?: Ship[]) {
        this.shots = shots ?? [];
        this.ships = ships ?? [];
    }
}

export class MatchPlayer {
    userId: string;
    board: BattleGrid;

    constructor(userId?: string, board?: BattleGrid) {
        this.board = board ?? new BattleGrid();
        this.userId = userId ?? " ";
    }

}

export class MatchResults {
    winner: string;

    constructor(winner?: string) {
        this.winner = winner ?? '';
    }
}

export class Match {
    _id: string;
    playerOne: MatchPlayer;
    playerTwo: MatchPlayer;
    result: MatchResults;
    playersChat: string;
    observersChat: string;
    gameTurn: string;

    constructor(_id: string,
        playerOne: MatchPlayer,
        playerTwo: MatchPlayer,
        result: MatchResults,
        playersChat: string,
        observersChat: string,
        gameTurn: string) {
        
            this._id = _id ?? '';
            this.playerOne = playerOne ?? new MatchPlayer();
            this.playerTwo = playerTwo ?? new MatchPlayer();
            this.result = result ?? new MatchResults();
            this.playersChat = playersChat ?? " ";
            this.observersChat = observersChat ?? emptyChat();
            this.gameTurn = gameTurn ?? ''; 
    }
}

export function getAllShips(){
    return [new Ship([], ShipLenght.Carrier, "Carrier", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Battleship, "Battleship", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Cruiser, "Cruiser", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Submarine, "Submarine", OrientationShip.Horizontal),
    new Ship([], ShipLenght.Destroyer, "Destroyer", OrientationShip.Horizontal)]
}

