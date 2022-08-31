import mongoose, { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { ChatInterface, ChatModel, ChatSchema, createChat } from "../chat";
import { getUserById, UserInterface } from "../user";
import { MatchPlayer, MatchPlayerSchema } from "../match/match-player";
import { MatchResults, MatchResultsSchema } from "../match/match-result";
import { Cell, CellType } from "./cell";




export interface MatchInterface extends Document {
    readonly _id: Types.ObjectId,
    playerOne: MatchPlayer,//vedere se utilizzare l'interfaccio o solo l'Id
    playerTwo: MatchPlayer,
    // turn: MatchTurn,//palyerOne, o playerTwo possibile utilizzo di un enum e vedere se mettere di default sempre il primo oppure lancio della monetina, oppure vedere se basare la posizione del giocatore in base all'elo
    result: MatchResults,
    playersChat: Types.ObjectId,//vedere se le chat devono essere due e quindi quale struttura dati utilizzare
    observersChat: Types.ObjectId,
    gameTurn: Types.ObjectId, // which player has the turn.

    makePlayerMove: (player: Types.ObjectId, shot: Cell) => Promise<MatchInterface> //funzione da chiamare quando finisce un turno di sicuro

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
        type: SchemaTypes.ObjectId,
    },
    observersChat: {
        type: SchemaTypes.ObjectId,
    }
});

MatchSchema.methods.makePlayerMove = async function (playerId: Types.ObjectId, shot: Cell): Promise<MatchInterface> {
    if (playerId !== this.gameTurn) {
        throw new Error("Not your turn");
    }
    try {
        const player = playerId === this.playerOne.userId ? this.playerOne : this.playerTwo;
        const opponent = playerId !== this.playerOne.userId ? this.playerOne : this.playerTwo;
        //TODO see if the shot has the same row and col of the opponent ship
        if (opponent.shipHasBeenHit()) {
            shot.cellType = CellType.Hit;
            if (opponent.board.areAllShipsDestroyed()) {
                gameOver(this, player, opponent);
            }
        }
        player.addShot(shot);
        this.gameTurn = opponent.userid;
        return this.save(); //TODO see if its worth return the matchinterface or if we should return  


    } catch (err) {
        throw err;
    }

}

export async function getMatchById(matchId: Types.ObjectId): Promise<MatchInterface> {
    return Match.findById(matchId);
}


export async function newMatch(playerOne: Types.ObjectId, playerTwo: Types.ObjectId): Promise<MatchInterface> {
    try {
        const _playerOne: UserInterface = await getUserById(playerOne);
        const _playerTwo: UserInterface = await getUserById(playerTwo);
        const delta_score: number = getExpectedScore(_playerOne.stats.elo, _playerTwo.stats.elo);
        _playerOne.setPlayState(true);//TODO drop the database due this 
        _playerTwo.setPlayState(true);
        const dataOne = { userId: _playerOne._id, elo: _playerOne.stats.elo, delta_score };
        const dataTwo = { userId: _playerTwo._id, elo: _playerTwo.stats.elo, delta_score: 1 - delta_score };
        const playersChat = await createChat([dataOne.userId, dataTwo.userId]);
        const observersChat = await createChat([]);

        var match = new Match({
            playerOne: dataOne,
            playerTwo: dataTwo,
            gameTurn: dataOne.userId,
            playersChat: playersChat._id,
            observerChat: observersChat._id
        });
        return match.save();
    }
    catch (err) {
        throw err;
    }
}

export async function gameOver(match: MatchInterface, winner: MatchPlayer, loser: MatchPlayer) {
    try {
        match.result.updateResult(winner.userId);
        const matchResult = (await match.save()).result;
        const winnerUser: UserInterface = await getUserById(winner.userId);
        const loserUser: UserInterface = await getUserById(loser.userId);
        winnerUser.stats.updateStats(winner, matchResult);
        loserUser.stats.updateStats(loser, matchResult);
        winnerUser.setPlayState(true);
        loserUser.setPlayState(true);
    }
    catch (err) {
        throw err;
    }
}

var matchModel: Model<MatchInterface>;
function getModel(): Model<MatchInterface> { // Return Model as singleton
    if (!matchModel) {
        matchModel = mongoose.model('Match', MatchSchema);
    }
    return matchModel;
}

export const Match: Model<MatchInterface> = getModel();

//returns the expected score of playerOne.
//https://mathspp-com.translate.goog/blog/elo-rating-system-simulation?_x_tr_sl=en&_x_tr_tl=it&_x_tr_hl=it&_x_tr_pto=op,sc    
function getExpectedScore(playerOneElo: number, playerTwoElo: number): number {
    return 1 / (1 + Math.pow(10, (playerOneElo - playerTwoElo) / 400));
}

