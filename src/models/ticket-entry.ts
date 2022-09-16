import { Document, Model, Schema, Types, SchemaTypes, SchemaType } from "mongoose";
import * as mongoose from "mongoose";
import { getUser, UserInterface } from "./user";

export interface TicketEntryInterface extends Document {
    readonly _id: Types.ObjectId;
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

// Creates a ticket entry for entering in the queue, with userId as parameter that will be unique one ticket by one.
export async function createTicket(userId: Types.ObjectId): Promise<TicketEntryInterface> {
    const playerQueued: UserInterface = await getUser(userId);
    const ticketEntry: any = { 
        userId: userId,
        elo: playerQueued.stats.elo,
        ticketTime: new Date()
    }

    const ticketEntryDoc: TicketEntryInterface = new TicketEntry(ticketEntry);
    return await ticketEntryDoc.save();

}
//Removes the ticket entry from the queue
export async function removeTicket(userId: Types.ObjectId): Promise<void> {
    try{
        const deleted = await TicketEntry.deleteOne({userId});
        if ( deleted.deletedCount == 0){
            throw new Error("Ticket not founded");
        }
    }catch(error){
        throw error;
    }
}



var ticketEntryModel;  
export function getModel(): Model<TicketEntryInterface> { 
    if (!ticketEntryModel) {
        ticketEntryModel = mongoose.model('MatchmakingQueue', TicketEntrySchema);
    }
    return ticketEntryModel;
}

export const TicketEntry: Model<TicketEntryInterface> = getModel();

