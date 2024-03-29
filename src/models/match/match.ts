import mongoose, { Document, Model, Schema, Types, SchemaTypes } from "mongoose";
import { ChatInterface, ChatModel, ChatSchema, createChat } from "../chat";
import { getUserById, UserInterface } from "../user";
import { MatchPlayer, MatchPlayerSchema } from "../match/match-player";
import { MatchResults, MatchResultsSchema } from "../match/match-result";
import { Cell, CellType } from "./cell";
import { BattleGrid } from "./battle-grid";
import { GameOverEmitter } from "../../socket-helper/Emitter/GameOverEmitter";
import ios from "../..";




export interface MatchInterface extends Document {
    readonly _id: Types.ObjectId,
    playerOne: MatchPlayer,
    playerTwo: MatchPlayer,
    result: MatchResults,
    playersChat: Types.ObjectId,
    observersChat: Types.ObjectId,
    gameTurn: Types.ObjectId,

    makePlayerMove: (player: Types.ObjectId, shot: Cell) => Promise<[Cell, string]> //funzione da chiamare quando finisce un turno di sicuro
    initBoardPlayer: (playerId: Types.ObjectId, board: BattleGrid) => Promise<MatchInterface>;
    arePlayersReady(): boolean;

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
        type: SchemaTypes.ObjectId,
    },
    observersChat: {
        type: SchemaTypes.ObjectId,
    },
    gameTurn: {
        type: SchemaTypes.ObjectId
    }
});

MatchSchema.methods.makePlayerMove = async function (playerId: Types.ObjectId, shot: Cell): Promise<[Cell, string]> {
    if (playerId != this.gameTurn) {
        throw new Error("Not your turn");
    }
    try {
        const player: MatchPlayer = playerId == this.playerOne.userId ? this.playerOne : this.playerTwo;
        const opponent: MatchPlayer = playerId != this.playerOne.userId ? this.playerOne : this.playerTwo;
        if (opponent.board.shipHasBeenHit(shot, this.id)) {
            shot.cellType = CellType.Hit;
            if (opponent.board.areAllShipsDestroyed()) {
                await (gameOver.bind(this))(player, opponent);
                return [shot, " "];
            }
        } else {
            shot.cellType = CellType.Miss;
        }
        player.board.addShot(shot);

        this.gameTurn = shot.cellType == CellType.Hit ? player.userId : opponent.userId;
        await this.save();
        return [shot, this.gameTurn];


    } catch (err) {
        throw err;
    }

}

MatchSchema.methods.initBoardPlayer = async function (playerId: Types.ObjectId, board: BattleGrid): Promise<MatchInterface> {
    try {
        if (board.ships.length == 0) {
            throw new Error();
        }
        const player: MatchPlayer = playerId == this.playerOne.userId ? this.playerOne : this.playerTwo;
        player.board = board;
        player.ready = true;
        return this.save();

    } catch (err) {
        throw err;
    }
}

MatchSchema.methods.arePlayersReady = function (): boolean {
    return this.playerOne.ready && this.playerTwo.ready;
}

export async function getMatchById(matchId: Types.ObjectId): Promise<MatchInterface> {
    let result = await Match.findById({ _id: matchId }).catch(
        (err) => Promise.reject('Server error')
    );
    if (result) return Promise.resolve(result);
    else return Promise.reject('No match with such Id'); //mettere dentro un errore?
}


export async function newMatch(playerOne: Types.ObjectId, playerTwo: Types.ObjectId): Promise<MatchInterface> {
    try {
        const _playerOne: UserInterface = await getUserById(playerOne);
        const _playerTwo: UserInterface = await getUserById(playerTwo);
        const delta_score: number = getExpectedScore(_playerOne.stats.elo, _playerTwo.stats.elo);
        const dataOne = { userId: _playerOne._id, elo: _playerOne.stats.elo, delta_score };
        const dataTwo = { userId: _playerTwo._id, elo: _playerTwo.stats.elo, delta_score: 1 - delta_score };
        const result = {};
        const playersChat = await createChat([dataOne.userId, dataTwo.userId]);
        const observersChat = await createChat([]);
        const gameTurn = Math.floor(Math.random() * 2) == 0 ? dataOne.userId : dataTwo.userId;

        var match: MatchInterface = new Match({
            playerOne: dataOne,
            playerTwo: dataTwo,
            gameTurn,
            playersChat: playersChat._id,
            observerChat: observersChat._id,
            result
        });
        return match.save();
    }
    catch (err) {
        throw err;
    }
}

export async function gameOver(winner: MatchPlayer, loser: MatchPlayer) {
    try {

        const matchResult = this.result.updateResult(winner.userId);
        const winnerUser: UserInterface = await getUserById(winner.userId);
        const loserUser: UserInterface = await getUserById(loser.userId);
        winnerUser.stats.updateStats(winner, matchResult);
        loserUser.stats.updateStats(loser, matchResult);
        await winnerUser.save();
        await loserUser.save();
        const matchId = this._id;
        const gameOver = new GameOverEmitter(ios, matchId.toString());
        gameOver.emit({ matchResult });

        var match = await Match.deleteOne({ _id: this._id });;
        return match;
       
    }
    catch (err) {
        throw err;
    }
}
export async function getMatchByPlayerId(playerId: Types.ObjectId):Promise<MatchInterface>{
   const match = await  Match.findOne( {$or :[{"playerOne.userId": playerId},{"playerTwo.userId": playerId}]});
   if(match){
    return Promise.resolve(match);
   }else{
    throw new Error("No match with such id");
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

