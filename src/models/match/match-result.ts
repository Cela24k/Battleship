import { Schema, SchemaTypes, Types } from "mongoose";

export interface MatchResults{
    winner : Types.ObjectId,
    startTime : Date,
    finishTime : Date,
    updateResult(winner: Types.ObjectId): void,
}

export const MatchResultsSchema = new Schema<MatchResults>({
    winner : {
        type: SchemaTypes.ObjectId,
        default: null
    },
    startTime: {
        type: SchemaTypes.Date,
        default: () => new Date() //TODO see if it returns a "now" Date
    },
    finishTime: {
        type: SchemaTypes.Date,
        default: 0

    }
    
},{_id: false})
MatchResultsSchema.methods.updateResult = async function(winner: Types.ObjectId){
    this.winner = winner;
    this.finishTime = new Date();
}