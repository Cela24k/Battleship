import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { ChatInterface } from "./chat";
import { UserInterface } from "./user";

export interface MatchInterface {
    readonly _id: Types.ObjectId,
    playerOne: UserInterface,//vedere se utilizzare l'interfaccio o solo l'Id
    playerTwo: Object,
    boardOne: Object,//da vedere in che modo rappresentare la board
    boardTwo: Object,
    turn: Boolean,//palyerOne, o playerTwo possibile utilizzo di un enum e vedere se mettere di default sempre il primo oppure lancio della monetina
    result: String,
    chats: [ChatInterface],//vedere se le chat devono essere due e quindi quale struttura dati utilizzare
    isGameOver : () => Boolean, //vede se ci sta un vincitore, vedere se returnarlo
    isValidMove : () => Boolean, //vede se una mossa fatta e' giusta
    updateBoard : () => void //funzione da chiamare quando finisce un turno di sicuro


}
export const MatchSchema = new Schema<MatchInterface>({
});
  
