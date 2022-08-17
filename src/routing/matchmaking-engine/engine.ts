import { Server, Socket } from "socket.io";
import { removeTicket, TicketEntry, TicketEntryInterface } from "../../models/ticket-entry"

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
    private async refreshSearchEngine(){
        this.timeoutId = setTimeout(async () => {return await this.searchEngine()}, this.interval);

    }
    
    private async searchEngine() {
        //console.log("I'm searching bi".bgYellow.black);
        const ticketList: TicketEntryInterface[] = await TicketEntry.find({}).sort({ticketTime : 1}); //the sorting parameter is an object with the sorting condition which value can be 1(ascending) or -1(descenting)
        
        while(ticketList.length > 1){
            const playerOne = ticketList.pop();
            const playerTwo = this.findOpponent(playerOne, ticketList);

            if(playerTwo!== null){
                console.log("Matchiamoo");
                console.log(playerTwo.toString());
                console.log(playerOne.toString());
                //TODO here we should put the match methods...
                removeTicket(playerOne.userId);
                removeTicket(playerTwo.userId);
                ticketList.pop();
            }
        }

        this.refreshSearchEngine();

    }

    private findOpponent(playerOne: TicketEntryInterface, ticketList: TicketEntryInterface[]) : TicketEntryInterface{
        return ticketList.filter((playerTwo: TicketEntryInterface) => this.arePlayersMatchable(playerOne, playerTwo)).pop()
    }
    //TODO study and implement an elo logic, try to find how to use it
    private arePlayersMatchable(playerOne: TicketEntryInterface, playerTwo: TicketEntryInterface){
        return playerOne.elo < playerTwo.elo + 10 && playerOne.elo > playerTwo.elo - 10;
    }
} 