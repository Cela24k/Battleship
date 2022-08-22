import { Document, Model, Schema, Types, SchemaTypes, trusted } from "mongoose";
import { ChatInterface, ChatSchema } from "../chat";
import { UserInterface } from "../user";
import { MatchPlayer, MatchPlayerSchema } from "../match/match-player";
import { MatchResults, MatchResultsSchema } from "../match/match-result";

export enum MatchTurn {
    playerOneTurn,
    playerTwoTurn
}


export interface MatchInterface extends Document {
    readonly _id: Types.ObjectId,
    playerOne: MatchPlayer,//vedere se utilizzare l'interfaccio o solo l'Id
    playerTwo: MatchPlayer,
    // turn: MatchTurn,//palyerOne, o playerTwo possibile utilizzo di un enum e vedere se mettere di default sempre il primo oppure lancio della monetina, oppure vedere se basare la posizione del giocatore in base all'elo
    result: MatchResults,
    playersChat: ChatInterface,//vedere se le chat devono essere due e quindi quale struttura dati utilizzare
    observersChat: ChatInterface,
    isGameOver : () => Boolean, //vede se ci sta un vincitore, vedere se returnarlo
    isValidMove : () => Boolean, //vede se una mossa fatta e' giusta
    updateBoard : () => void //funzione da chiamare quando finisce un turno di sicuro


}
export const MatchSchema = new Schema<MatchInterface>({
    playerOne: {
        type: MatchPlayerSchema,
        required: true
    },
    playerTwo: {
        type: MatchPlayerSchema,
        required: true
    },
    result: {
        type: MatchResultsSchema,
        required: true
    },
    playersChat: {
        type: ChatSchema,
        required: true
    } ,
    observersChat: {
        type: ChatSchema,
        required: true
    }
});
  
