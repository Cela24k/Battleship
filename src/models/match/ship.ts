import { Schema, SchemaType, SchemaTypes, Types } from "mongoose";
import { Cell, CellSchema, CellType } from "./cell";



export enum ShipLenght {
    Carrier = 5,
    Battleship = 4,
    Cruiser = 3,
    Submarine = 3,
    Destroyer = 2
}

enum OrientationShip {
    Horizontal,
    Vertical
}

export interface Ship extends Types.Subdocument {
    position: Cell[];
    length: ShipLenght;
    orientation: OrientationShip;
    type: string;
    isDestroyed(): boolean;
    hasBeenHit(shot: Cell): boolean;
}

export const ShipSchema = new Schema<Ship>({
    position: {
        type: [CellSchema],
        required: true
    },
    orientation: {
        type: SchemaTypes.Number,
        enum: OrientationShip
    },

    length: {
        type: SchemaTypes.Number,
        enum: ShipLenght,
        required: true,
    },
    type: {
        type: SchemaTypes.String
    }
}, { _id: false })

ShipSchema.methods.isDestroyed = function (): boolean {
    return this.position.every((c: Cell) => c.cellType == CellType.Hit)

}

ShipSchema.methods.hasBeenHit = function (shot: Cell): boolean {
    if (shot) {
        var flag = false;
        this.position.forEach((c: Cell) => {
            if (c.row === shot.row && c.col === shot.col) {
                c.cellType = CellType.Hit;
                flag = true;
            }
        })
        return flag;
        
    } else {
        throw new Error("Shot Compromised");
    }
}

function isVertical(ship: Ship): boolean {
    return ship.position.every((c: Cell, i: number, arr: Cell[]) => c.col == arr[0].col);
}
function isHorizontal(ship: Ship): boolean {
    return ship.position.every((c: Cell, i: number, arr: Cell[]) => c.row == arr[0].row);
}



function areCellConsecutive(ship: Ship): boolean {
    const prev = ship.position[0];
    for (let i = 0; i < ship.length - 1; i++) {
        const cond = ship.orientation == OrientationShip.Horizontal ? (prev.col != ship.position[i + 1].col) : prev.row != ship.position[i + 1].row;
        if (!cond) {
            return false;
        }
    }
    return true;
}



// It controls if the ship is positioned in the right way;
ShipSchema.pre("save", function (this, next) {
    if (this.position.length > 0) {
        const isLengthOk: boolean = this.position.length == this.length;
        const isPositionOk: boolean = isVertical(this) || isHorizontal(this);
        const orientation: OrientationShip = isVertical(this) ? OrientationShip.Vertical : OrientationShip.Horizontal;
        const isConsecutive: boolean = areCellConsecutive(this);


        if (!(isLengthOk && isPositionOk && isConsecutive)) {

            throw new Error("Ships Bad Positioned");
        }
    }
    next();
})

