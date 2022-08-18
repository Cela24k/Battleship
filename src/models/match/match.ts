import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { ChatInterface } from "../chat";
import { UserInterface } from "../user";
import { MatchPlayer } from "../match/match-player";

export enum MatchTurn {
    playerOneTurn,
    playerTwoTurn
}

export interface MatchResults{
    winner : Types.ObjectId,
    startTime : Date,
    finishTime : Date,
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
});
  
