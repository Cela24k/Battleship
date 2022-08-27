import mongoose, { Document, Model, Schema, Types, SchemaTypes, trusted } from "mongoose";
import { ChatInterface, ChatModel, ChatSchema, createChat } from "../chat";
import { getUserById, UserInterface } from "../user";
import { MatchPlayer, MatchPlayerSchema } from "../match/match-player";
import { MatchResults, MatchResultsSchema } from "../match/match-result";
import { Cell, CellType } from "./cell";

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
    gameTurn: Types.ObjectId, // which player has the turn.
    isGameOver : () => Boolean, //vede se ci sta un vincitore, vedere se returnarlo
    makePlayerMove : (player: Types.ObjectId) => void //funzione da chiamare quando finisce un turno di sicuro

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

MatchSchema.methods.makePlayerMove = async function(playerId: Types.ObjectId, shot: Cell){
    if(playerId!==this.gameTurn){
        throw new Error("Not your turn");
    }
    try{
        const player = playerId===this.playerOne.userId ? this.playerOne : this.playerTwo; 
        const opponent = playerId!==this.playerOne.userId ? this.playerOne : this.playerTwo; 
        //TODO see if the shot has the same row and col of the opponent ship
        if(opponent.shipHasBeenHit()){
            shot.cellType = CellType.Hit;
            //should we emit the listener her for shot hitted?
        }
        player.addShot(shot);
    }catch(err){
        throw err;
    }
    
}

export async function newMatch(playerOne: Types.ObjectId, playerTwo: Types.ObjectId): Promise<MatchInterface>{
    const _playerOne: UserInterface = await getUserById(playerOne);
    const _playerTwo: UserInterface = await getUserById(playerTwo);
    const dataOne = {userId: _playerOne.id, elo: _playerOne.stats.elo};
    const dataTwo = {userId: _playerTwo.id, elo: _playerTwo.stats.elo};
    const playersChat = createChat([dataOne.userId, dataTwo.userId]);
    const observersChat = createChat([]); //TODO we need to save the chats here
    const data = {playerOne: dataOne, playerTwo: dataTwo, gameTurn:dataOne.userId, playersChat, observersChat }
    
    var match = new Match(data);
    return match
}

var matchModel: Model<MatchInterface>;
function getModel(): Model<MatchInterface> { // Return Model as singleton
    if (!matchModel) {
        matchModel = mongoose.model('Match', MatchSchema);
    }
    return matchModel;
}

export const Match: Model<MatchInterface> = getModel();

