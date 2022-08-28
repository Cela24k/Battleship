import { Schema, SchemaTypes, Types } from "mongoose";
import { BattleGrid, BattleGridSchema } from "./battle-grid";

export interface MatchPlayer {
    userId: Types.ObjectId,
    board: BattleGrid,
    shotsFired: number,
    shotsHitted: number,
    delta_score: number,
    elo: number
}

export const MatchPlayerSchema = new Schema<MatchPlayer>({
    userId: {
        type: SchemaTypes.ObjectId,
        requires: true,
        unique: true,
    },
    board : {
        type: BattleGridSchema,
    },
    shotsFired: {
        type: SchemaTypes.Number,
        default: 0
    },
    shotsHitted: {
        type: SchemaTypes.Number,
        default: 0
    },
    elo: {
        type: SchemaTypes.Number,
        required: true
    },
    delta_score:{
        type: SchemaTypes.Number,
        required: true
    },

})