import { Schema, SchemaTypes, Types } from "mongoose";
import { BattleGrid, BattleGridSchema } from "./battle-grid";

export interface MatchPlayer {
    userId: Types.ObjectId,
    board: BattleGrid,
    delta_score: number,
    elo: number,
    ready: boolean
    
    
}

export const MatchPlayerSchema = new Schema<MatchPlayer>({
    userId: {
        type: SchemaTypes.ObjectId,
        requires: true,
    },
    board : {
        type: BattleGridSchema,
    },
    elo: {
        type: SchemaTypes.Number,
        required: true
    },
    delta_score:{
        type: SchemaTypes.Number,
        required: true
    },
    ready: {
        type: SchemaTypes.Boolean,
        default: false
    }
    
},{_id: false});



