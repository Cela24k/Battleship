import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { ChatInterface } from "./chat";
import { UserInterface } from "./user";

export enum MatchTurn {
    playerOneTurn,
    playerTwoTurn
}

export interface BattleGrid{
    //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
    //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
    //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
    //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.

}

export interface Coordinates{
    row : number,
    col : number
}

export interface MatchPlayer {
    userId: Types.ObjectId,
    board: BattleGrid,
    shotsFired: Number,
    

}
export interface MatchResults{
    winner : Types.ObjectId,
    shotsFired : number,
    playingTime : Date
}


export interface MatchInterface {
    readonly _id: Types.ObjectId,
    playerOne: MatchPlayer,//vedere se utilizzare l'interfaccio o solo l'Id
    playerTwo: MatchPlayer,
    turn: MatchTurn,//palyerOne, o playerTwo possibile utilizzo di un enum e vedere se mettere di default sempre il primo oppure lancio della monetina, oppure vedere se basare la posizione del giocatore in base all'elo
    result: MatchResults,
    playersChat: ChatInterface,//vedere se le chat devono essere due e quindi quale struttura dati utilizzare
    observersChat: ChatInterface,
    isGameOver : () => Boolean, //vede se ci sta un vincitore, vedere se returnarlo
    isValidMove : () => Boolean, //vede se una mossa fatta e' giusta
    updateBoard : () => void //funzione da chiamare quando finisce un turno di sicuro


}
export const MatchSchema = new Schema<MatchInterface>({
});
  
