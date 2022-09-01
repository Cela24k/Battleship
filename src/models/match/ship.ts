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
    length: ShipLenght;
    isDestroyed(): boolean;
    hasBeenHit(shot: Cell): boolean;
}

export const ShipSchema = new Schema<Ship>({
    position: {
        type: [CellSchema],
        required: true//TODO see how can i make them unique(or if we should put everything in the frontend)
    },
    length: {
        type: SchemaTypes.Number,
        enum: ShipLenght,
        required: true,
    }
})

ShipSchema.methods.isDestroyed = function (): boolean {
    this.position.forEach((c: Cell) => {
        if (c.cellType != CellType.Hit)
            return false;
    })

    return true;

}

ShipSchema.methods.hasBeenHit = function(shot: Cell): boolean{
    this.position.forEach((c: Cell) => {
        if(c.row === shot.row && c.col === shot.col){
            c.cellType = CellType.Hit;
            return true;
        } 
    })
    return false;
}

function isVertical(ship : Ship): boolean{
    var flag = true;
    ship.position.forEach((c: Cell) =>){

    }
    return true;
}

ShipSchema.pre("save", function(this, next){
    const isLengthOk = this.position.length == this.length;
    const isPositionOk =  isVertical(this) || isHorizontal(this);
})

