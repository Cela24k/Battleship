import { Server, Socket } from "socket.io";
import { TicketEntry, TicketEntryInterface } from "../../models/ticket-entry"

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
        console.log("I'm searching bi".bgYellow.black);
        const ticketList: TicketEntryInterface[] = await TicketEntry.find({}).sort({ticketTime : -1}); //the sorting parameter is an object with the sorting condition which value can be 1(ascending) or -1(descenting)
        
        while(ticketList.length > 0){
            ticketList.pop();//TODO we should put here all the searching logic.
        }

        this.refreshSearchEngine();

    }
} 