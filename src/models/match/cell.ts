import { Schema, SchemaTypes } from "mongoose"

export interface Cell{
    row : number,
    col : number,
    cellType : CellType
}


export enum CellType {
    Empty = 'Empty',
    Hit = 'Hit',
    Miss = 'Miss',
    Ship = 'Ship'
}

export const CellSchema = new Schema<Cell>({
    row : {
        type: SchemaTypes.Number,
        required: true
    },
    col : {
        type: SchemaTypes.Number,
        required: true
    },
    cellType : {
        type: String,
        enum: CellType,
        required: true,
        default: CellType.Empty
    }
})