import { Schema, SchemaType, SchemaTypes, Types } from "mongoose";
import { Cell, CellSchema } from "./cell";

export enum ShipType {
    Carrier = "Carrier",
    Battleship = "Battleship",
    Cruiser = "Cruiser",
    Destroyer = "Destroyer",
    Submarine = "Submarine",
}

enum ShipLenght {
    Carrier = 5,
    Battleship = 4,
    Cruiser = 3,
    Submarine = 3,
    Destroyer = 2
}

export interface Ship extends Types.Subdocument {
    position: Cell[];
    length: ShipLenght;
    shipType: ShipType;
    isDestroyed(): boolean;
}

export const ShipSchema = new Schema<Ship>({
    position: {
        type: [CellSchema],
        required: true
    },
    length: {
        type: SchemaTypes.Number,
        enum: ShipLenght,
        required: true,
    },
    shipType: {
    type: SchemaTypes.String,
    enum: ShipType,
    required: true,
    }
})




