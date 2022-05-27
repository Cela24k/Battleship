import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";

export interface MatchInterface {
    player1: Object,
    player2: Object,
    board: Object,

}
export const MatchSchema = new Schema<MatchInterface>({
});
  
export interface ChatInterface extends Document{
    messages: [MatchInterface];
    users: [Types.ObjectId];

    /* Idk if this goes here or in User class*/

    /* TODO: other methods*/
}