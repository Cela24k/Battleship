import { Types } from "mongoose";
import { BattleGrid } from "./battle-grid";

export interface MatchPlayer {
    userId: Types.ObjectId,
    board: BattleGrid,
    shotsFired: Number,
    shotsHitted: Number,
    delta_score: Number,
    elo: Number
}