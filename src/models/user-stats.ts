import { Schema, SchemaTypes } from "mongoose";
import { MatchInterface } from "./match/match";
import { MatchPlayer } from "./match/match-player";
import { MatchResults } from "./match/match-result";
const K_VALUE = 32;
export interface StatsInterface {
    wins: number,
    losses: number,
    winstreak: number,
    maxWinstreak: number,
    elo: number,
    playedGames: number,
    shotsFired: number,
    shotsHit: number,
    accuracy: number,
    timePlayed: Date,
    //TODO see if it's worth call just one method to update everystats.
    winsAdd(): void,
    lossesAdd(): void,
    winstreakAdd(): void,
    winstreakReset(): void,
    eloIncrement(expected_score: number, actual_score: number): void,
    accuracySet(): void,
    win(): void,
    lose(): void,
    updateStats(player: MatchPlayer, result: MatchResults): void;
}

export const StatsSchema = new Schema<StatsInterface>({
    wins: {
        type: SchemaTypes.Number,
        default: 0,
    },
    losses: {
        type: SchemaTypes.Number,
        default: 0,
    },
    accuracy:{
        type: SchemaTypes.Number,
    },
    winstreak: {
        type: SchemaTypes.Number,
        default: 0,
    },
    maxWinstreak: {
        type: SchemaTypes.Number,
        default: 0,
    },
    elo: {
        type: SchemaTypes.Number,
        default: 1000,
    },
    playedGames: {
        type: SchemaTypes.Number,
        default: 0,
    },
    shotsFired: {
        type: SchemaTypes.Number,
        default: 0
    },
    shotsHit: {
        type: SchemaTypes.Number,
        default: 0
    },
    timePlayed: {
        type: SchemaTypes.Date,
        default: new Date(0),
    }
    
},{_id: false})


StatsSchema.methods.winsAdd = function (): void {
    this.wins++;
    this.playedGames++;
}

StatsSchema.methods.lossesAdd = function (): void {
    this.losses++;
    this.playedGames++;
}

StatsSchema.methods.winstreakAdd = function (): void {
    this.winstreak++;
    if (this.maxWinstreak < this.winstreak)
        this.maxWinstreak = this.winstreak;
}

StatsSchema.methods.winstreakReset = function (): void {
    this.winstreak = 0;
}

StatsSchema.methods.eloIncrement = function (amount: number): void {
    if (this.elo + amount < 0)
        this.elo = 0;
    else this.elo += amount;
}
StatsSchema.methods.accuracySet = function (): void {
    this.accuracy = this.shotsFired != 0 ? this.shotsHit / this.shotsFired : 0;
}

StatsSchema.methods.win = function (): void {
    this.winsAdd();
    this.winstreakAdd();
    
}
StatsSchema.methods.lose = function (): void {
    this.lossesAdd();
    this.winstreakReset();
}

//TODO see if everything is correct;
StatsSchema.methods.updateStats = function(player: MatchPlayer, result: MatchResults) : void {
    if(result.winner == player.userId){
        this.win();
        this.eloIncrement(K_VALUE*(1 - player.delta_score));
    }else{
        this.lose();
        this.eloIncrement(K_VALUE*(0 - player.delta_score));

    }
    this.shotsFired += player.board.shotsFired;
    this.shotsHit += player.board.shotsHitted;
    const timePlayed: Date = new Date((result.finishTime.getTime() - result.startTime.getTime()) + this.timePlayed.getTime());

    this.timePlayed = timePlayed;
    
    this.accuracySet();
}



