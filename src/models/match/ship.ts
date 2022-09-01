import { Schema, SchemaType, SchemaTypes, Types } from "mongoose";
import { Cell, CellSchema, CellType } from "./cell";



export enum ShipLenght {
    Carrier = 5,
    Battleship = 4,
    Cruiser = 3,
    Submarine = 3,
    Destroyer = 2
}

export interface Ship extends Types.Subdocument {
    position: Cell[];
    shipType: ShipLenght;
    isDestroyed(): boolean;
    hasBeenHit(shot: Cell): boolean;
}

export const ShipSchema = new Schema<Ship>({
    position: {
        type: [CellSchema],
        required: true//TODO see how can i make them unique(or if we should put everything in the frontend)
    },
    shipType: {
        type: SchemaTypes.Number,
        enum: ShipLenght,
        required: true,
    }
},{_id: false})

ShipSchema.methods.isDestroyed = function (): boolean {
    this.position.forEach((c: Cell) => {
        if (c.cellType != CellType.Hit)
            return false;
    })

    return true;

}

ShipSchema.methods.hasBeenHit = function (shot: Cell): boolean {
    this.position.forEach((c: Cell) => {
        if (c.row === shot.row && c.col === shot.col) {
            c.cellType = CellType.Hit;
            return true;
        }
    })
    return false;
}

function isVertical(ship: Ship): boolean {
    return ship.position.every((c: Cell, i: number, arr: Cell[]) => c.col == arr[0].col);
}
function isHorizontal(ship: Ship): boolean {
    return ship.position.every((c: Cell, i: number, arr: Cell[]) => c.row == arr[0].row);
}

enum OrientationShip {
    Horizontal,
    Vertical
}

function areCellConsecutive(ship: Ship, orientation: OrientationShip): boolean {
    const prev = ship.position[0];
    for (let i = 0; i < ship.shipType - 1; i++) {
        const cond = orientation == OrientationShip.Horizontal ? (prev.row != ship.position[i + 1].row) : prev.col != ship.position[i + 1].col;
        if (!cond) {
            return false;
        }
    }
    return true;
}

// It controls if the ship is positioned in the right way;
ShipSchema.pre("save", function (this, next) {
    if (this.position.length > 0) {
        const isLengthOk: boolean = this.position.length == this.shipType;
        const isPositionOk: boolean = isVertical(this) || isHorizontal(this);
        const orientation: OrientationShip = isVertical(this) ? OrientationShip.Vertical : OrientationShip.Horizontal;
        const isConsecutive: boolean = areCellConsecutive(this, orientation);

        if (!(isLengthOk && isPositionOk && isConsecutive)) {

            throw new Error("Ships Bad Positioned");
        }
    }
    next();
})

