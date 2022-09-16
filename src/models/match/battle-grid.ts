import { Schema, SchemaTypes, Types } from "mongoose"
import ios from "../..";
import { ShipDestroyedEmitter } from "../../socket-helper/Emitter/ShipDestroyedEmitter";
import { Cell, CellSchema, CellType } from "./cell"
import { Ship, ShipLenght, ShipSchema } from "./ship"


export interface BattleGrid {

    shots: Cell[],
    ships: Ship[],
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
    if (shot.cellType == CellType.Hit) this.shotsHitted++;
    return this.shots.push(shot);
}

BattleGridSchema.methods.shipHasBeenHit = function (shot: Cell, matchId: Types.ObjectId) {
    const result: Ship[] = this.ships.filter((s: Ship) => s.hasBeenHit(shot));
    const flag = result[0]?.isDestroyed() ?? false;
    if (flag) {
        const shipDestroyed = new ShipDestroyedEmitter(ios, matchId.toString());
        shipDestroyed.emit({ ship: result[0] });

    }
    return result.length != 0;

}


export function isTooClose(ships: Cell[], cell: Cell) {
    return ships.some((pos) => pos.row == cell.row + 1 && pos.col == cell.col + 1 ||
        pos.row == cell.row + 1 && pos.col == cell.col - 1 ||
        pos.row == cell.row - 1 && pos.col == cell.col + 1 ||
        pos.row == cell.row - 1 && pos.col == cell.col - 1)
}
//It controls if the ships' cells number are not compromised
BattleGridSchema.pre("save", function (this, next) {
    if (this.ships.length > 0) {
        var cells: Cell[] = [];
        var clength: number = 0;
        this.ships.forEach((ship: Ship) => {
            ship.position.forEach((c: Cell) => {
                if (cells.includes(c) || isTooClose(cells, c)) {
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