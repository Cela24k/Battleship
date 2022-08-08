import { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { ChatInterface } from "./chat";
import { UserInterface } from "./user";

export enum MatchTurn {
    playerOneTurn,
    playerTwoTurn
}


export interface MatchInterface {
    readonly _id: Types.ObjectId,
    playerOne: UserInterface,//vedere se utilizzare l'interfaccio o solo l'Id
    playerTwo: Object,//TODO se mettessimo all'interno del model solo la user interface, dovremmo avere sempre due statistiche del game per ogni stats(ex. colpi tirati nel gioco). Vedere se creare una nuova interface per proiettare il contenuto all'interno di essa
    boardOne: Object,//da vedere in che modo rappresentare la board
    boardTwo: Object,
    turn: MatchTurn,//palyerOne, o playerTwo possibile utilizzo di un enum e vedere se mettere di default sempre il primo oppure lancio della monetina, oppure vedere se basare la posizione del giocatore in base all'elo
    result: String,
    chats: [ChatInterface],//vedere se le chat devono essere due e quindi quale struttura dati utilizzare
    isGameOver : () => Boolean, //vede se ci sta un vincitore, vedere se returnarlo
    isValidMove : () => Boolean, //vede se una mossa fatta e' giusta
    updateBoard : () => void //funzione da chiamare quando finisce un turno di sicuro


}
export const MatchSchema = new Schema<MatchInterface>({
});
  
