import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import ChatEmitter from "../Emitter/ChatMessageEmitter";
import { Listener } from "./Listener";
import { getMatchById } from "../../models/match/match";
import MatchTurnEmitter from "../Emitter/MatchTurnEmitter";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class MatchInitListener extends Listener{

    public readonly ios: Server;
    constructor(ios: Server, client: Socket){
        super(client, 'init');
        this.ios = ios;
    }

    listen(): void {
        this.ios.on(this.event, async (data)=>{//TODO qui si avranno anche le chaiamate al databse
            const match = await getMatchById(data.matchId);
            if(match.playerOne.ready && match.playerTwo.ready){
                const turnEmitter = new MatchTurnEmitter(this.ios, (match._id).toString());
                turnEmitter.emit({turn: match.gameTurn});
                console.log("MatchInizializzzto".america);
            }
        })
    }

}