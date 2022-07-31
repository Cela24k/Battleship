import { Document, Model, Schema, Types, SchemaTypes, SchemaType } from "mongoose";
import * as mongoose from "mongoose";
import { getUser, UserInterface } from "./user";

export interface TicketEntryInterface extends Document {
    userId: Types.ObjectId;
    elo: number;
    ticketTime: Date;

}

export const TicketEntrySchema = new Schema<TicketEntryInterface>({
    userId: {
        type: SchemaTypes.ObjectId,
        required: true,
        unique: true
    },
    elo: {
        type: SchemaTypes.Number,
        required: true
    },
    ticketTime: {
        type: SchemaTypes.Date,
        default: () => new Date()
    }
})


export async function createTicket(userId: Types.ObjectId): Promise<void> {
    const playerQueued: UserInterface = await getUser(userId);
    const ticketEntry: any = { // if i put TicketEntryInterface as type gets me some errors, see that.
        userId: userId,
        elo: playerQueued.stats.elo,
        ticketTime: new Date()
    }

    const ticketEntryDoc: TicketEntryInterface = new TicketEntry(ticketEntry);
    await ticketEntryDoc.save();

}

export async function removeTicket(userId: Types.ObjectId): Promise<void> {
    try{
        await TicketEntry.deleteOne({userId});
    }catch(error){
        throw error;
    }
}

var ticketEntryModel;  // This is not exposed outside the model
export function getModel(): Model<TicketEntryInterface> { // Return Model as singleton
    if (!ticketEntryModel) {
        ticketEntryModel = mongoose.model('MatchmakingQueue', TicketEntrySchema);
    }
    return ticketEntryModel;
}

export const TicketEntry: Model<TicketEntryInterface> = getModel();

