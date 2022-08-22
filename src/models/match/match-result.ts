import { Schema, SchemaTypes, Types } from "mongoose";

export interface MatchResults{
    winner : Types.ObjectId,
    startTime : Date,
    finishTime : Date,
}

export const MatchResultsSchema = new Schema<MatchResults>({
    winner : {
        type: SchemaTypes.ObjectId,
        default: null
    },
    startTime: {
        type: SchemaTypes.Date,
        default: () => new Date()
    },
    finishTime: {
        type: SchemaTypes.Date,
        default: 0

    }
})