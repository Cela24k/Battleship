import { Schema, SchemaTypes, Types } from "mongoose"
import ios from "../..";
import { ShipDestroyedEmitter } from "../../socket-helper/Emitter/ShipDestroyedEmitter";
import { Cell, CellSchema, CellType } from "./cell"
import { Ship, ShipLenght, ShipSchema } from "./ship"


export interface BattleGrid {
    //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
    //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
    //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
    //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.
    shots: Cell[], // Shots array for our "grid", the cells have a cellType(see in cell.ts) which helps us for the frontend
    ships: Ship[],// Ships array that could be studied for the opponent shots.
    shotsFired: number,
    shotsHitted: number,
    areAllShipsDestroyed: () => boolean,
    isAlreadyShot: (shot: Cell) => boolean,
    shipHasBeenHit: (shot: Cell, matchId: Types.ObjectId) => boolean,
    addShot: (shot: Cell) => void,

}


export const BattleGridSchema = new Schema<BattleGrid>({
    shots: {
        type: [CellSchema],
        default: []
    },
    ships: {
        type: [ShipSchema],
        default: []
    },
    shotsFired: {
        type: SchemaTypes.Number,
        default: 0
    },
    shotsHitted: {
        type: SchemaTypes.Number,
        default: 0
    },
}, { _id: false });

BattleGridSchema.methods.areAllShipsDestroyed = function () {
    return this.ships.every((s: Ship) => s.isDestroyed());
}

BattleGridSchema.methods.isAlreadyShot = function (shot: Cell) {
    return this.shots.some((s: Cell) => s.row == shot.row && s.col === shot.col);
    
}

BattleGridSchema.methods.addShot = function (shot: Cell) {
    const bool = this.isAlreadyShot(shot);
    if (bool) {
        throw new Error("You alreay shot this Cell");
    }
    this.shotsFired++;
    if(shot.cellType == CellType.Hit) this.shotsHitted++;
    return this.shots.push(shot);
}

BattleGridSchema.methods.shipHasBeenHit = function (shot: Cell, matchId: Types.ObjectId) {
    const result: Ship[] = this.ships.filter((s: Ship) => s.hasBeenHit(shot));
    const flag = result[0]?.isDestroyed() ?? false;
    if(flag){
        const shipDestroyed = new ShipDestroyedEmitter(ios,matchId.toString());
        shipDestroyed.emit({ship: result[0]});
        
    }
    return result.length != 0;
    
}
//It controls if the ships' cells number are not compromised
BattleGridSchema.pre("save", function (this, next) {
    if (this.ships.length > 0) {
        var cells: Cell[] = [];
        var clength: number = 0;
        this.ships.forEach((ship: Ship) => {
            ship.position.forEach((c: Cell) => {
                if (cells.includes(c)) {
                    throw new Error("Ships compromised");
                }
                cells.push(c);
            })
            clength += ship.position.length;
        })
        if (this.ships.length != 5 || clength != 17) {
            throw new Error("Ships compromised");
        }
    }

    next();
})