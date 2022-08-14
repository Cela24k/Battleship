import { Socket } from "socket.io";

export class MatchMakingEngine {
    private timeoutId: NodeJS.Timeout;
    private serverIo : Socket;
    private interval : number;

    constructor(serverIo : Socket, interval: number){
        this.timeoutId = null;
        this.serverIo = serverIo;
        this.interval = interval;
    }

    public start(){
        if(this.timeoutId != null){
            throw new Error("MatchMaking Engine already started");
        }
        this.timeoutId = setTimeout(this.generateMatches, this.interval);
    }
    //TODO implement the loop in which you should find every time a good players matching
    private generateMatches(){

    }
} 