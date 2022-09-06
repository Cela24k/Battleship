import { Server, Socket } from "socket.io";
import { newMatch } from "../../models/match/match";
import { removeTicket, TicketEntry, TicketEntryInterface } from "../../models/ticket-entry"
import NewMatchEmitter from "../../socket-helper/Emitter/NewMatchEmitter";
//This class provides an engine wicha aim is to arrange matches beetween players who join in the ticket list.
const SCORE_SCALING = 400;
const K_VALUE = 32;

export class MatchMakingEngine {
    private timeoutId: NodeJS.Timeout;
    private serverIo: Server;
    private interval: number;

    constructor(serverIo: Server, interval: number) {
        this.timeoutId = null;
        this.serverIo = serverIo;
        this.interval = interval;
    }

    public start() {
        if (this.timeoutId != null) {
            throw new Error("MatchMaking Engine already started");
        }
        console.log("Matchmaking Engine Started".america);
        this.refreshSearchEngine();
    }
    //this function refresh every time the timeout binding. Clearing the previous one could be cozy xP
    private async refreshSearchEngine() {
        this.timeoutId = setTimeout(async () => { return await this.searchEngine() }, this.interval);

    }

    private async searchEngine() {
        // console.log("I'm searching bi".bgYellow.black);
        try{const ticketList: TicketEntryInterface[] = await TicketEntry.find({}).sort({ ticketTime: 1 }); //the sorting parameter is an object with the sorting condition which value can be 1(ascending) or -1(descenting)
        //it loops when the queue has at least 2 players.
        while (ticketList.length > 1) {
            const playerOne = ticketList.pop();
            const playerTwo = this.findOpponent(playerOne, ticketList);

            if (playerTwo != null) {
                console.log("Matchiamoo".rainbow);
                const match = await newMatch(playerOne.userId, playerTwo.userId);
                //TODO newmatch emitter needded.
                const emitterOne = new NewMatchEmitter(this.serverIo, (playerOne.userId).toString());
                const emitterTwo = new NewMatchEmitter(this.serverIo, (playerTwo.userId).toString());
                emitterOne.emit(match);
                emitterTwo.emit(match);
                await removeTicket(playerOne.userId);
                await removeTicket(playerTwo.userId);
                ticketList.pop();
                ticketList.splice(ticketList.indexOf(playerTwo), 1);
            }
        }

        this.refreshSearchEngine();}
        catch(err){
            console.log(err);
        }

    }

    private findOpponent(playerOne: TicketEntryInterface, ticketList: TicketEntryInterface[]): TicketEntryInterface {
        return ticketList.filter((playerTwo: TicketEntryInterface) => this.arePlayersMatchable(playerOne, playerTwo)).pop()
    }
    //TODO study and implement an elo logic, try to find how to use it
    private arePlayersMatchable(playerOne: TicketEntryInterface, playerTwo: TicketEntryInterface): boolean {
        const now = (new Date()).getTime();
        const elapsedTimeOne = (now - playerOne.ticketTime.getTime()) / 1000;
        const elapsedTimeTwo = (now - playerOne.ticketTime.getTime()) / 1000;
        return (playerOne.elo < playerTwo.elo + K_VALUE * 4 && playerOne.elo > playerTwo.elo - K_VALUE * 4) || (elapsedTimeOne > 25 && elapsedTimeTwo > 25);
    }

    //returns the expected score of playerOne.
    //https://mathspp-com.translate.goog/blog/elo-rating-system-simulation?_x_tr_sl=en&_x_tr_tl=it&_x_tr_hl=it&_x_tr_pto=op,sc

} 