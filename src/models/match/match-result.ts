import { Schema, SchemaTypes, Types } from "mongoose";

export interface MatchResults {
    winner: Types.ObjectId,
    startTime: Date,
    finishTime: Date,
    updateResult(winner: Types.ObjectId): MatchResults,
}

export const MatchResultsSchema = new Schema<MatchResults>({
    winner: {
        type: SchemaTypes.String,
        default: ""
    },
    startTime: {
        type: SchemaTypes.Date,
        default: Date.now //TODO see if it returns a "now" Date
    },
    finishTime: {
        type: SchemaTypes.Date,
        default: 0

    }

}, { _id: false })

MatchResultsSchema.methods.updateResult = function (winner: Types.ObjectId): MatchResults{
    this.winner = winner;
    this.finishTime = new Date();
    return this;
}