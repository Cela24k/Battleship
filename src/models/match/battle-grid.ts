import { Schema } from "mongoose"
import { Cell, CellSchema } from "./cell"
import { Ship, ShipLenght, ShipSchema } from "./ship"


export interface BattleGrid {
    //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
    //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
    //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
    //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.
    shots: Cell[], // Shots array for our "grid", the cells have a cellType(see in cell.ts) which helps us for the frontend
    ships: Ship[],// Ships array that could be studied for the opponent shots.
    areAllShipsDestroyed: () => boolean,
    isAlreadyShot: () => boolean,
    shipHasBeenHit: () => boolean,
    addShot: () => void,

}


export const BattleGridSchema = new Schema<BattleGrid>({
    shots: {
        type: [CellSchema],
        default: []
    },
    ships: {
        type: [ShipSchema],
        default: []
    }
},{_id: false});

BattleGridSchema.methods.areAllShipsDestroyed = function () {
    this.ships.forEach((s: Ship) => {
        if (!s.isDestroyed()) {
            return false;
        }
    })
    return true;
}

BattleGridSchema.methods.isAlreadyShot = function (shot: Cell) {
    this.shots.forEach((s: Cell) => {
        if (s.row === shot.row && s.col === shot.col)
            return true;
    })
    return false;
}

BattleGridSchema.methods.addShot = function (shot: Cell) {
    if (this.isAlreadyShot(shot)) {
        throw new Error("You alreay shot this Cell");
    }

    return this.shots.push(shot);
}

BattleGridSchema.methods.shipHasBeenShot = function (shot: Cell) {
    this.ships.forEach((s: Ship) => {
        if (s.hasBeenHit(shot)) {
            return true;
        }

    })
    return false;
}
//It controls if the ships' cells number are not compromised
BattleGridSchema.pre("save", function (this, next) {
    var cells: Cell[] = [];
    this.ships.forEach((ship: Ship) => {
        ship.position.forEach((c:Cell) => {
            if(cells.includes(c)){
                throw new Error("Ships compromised");
            }
            cells.push(c);
        })
    })
    if(this.ships.length != 5){
        throw new Error("Ships compromised")
    }

    
    next();
})