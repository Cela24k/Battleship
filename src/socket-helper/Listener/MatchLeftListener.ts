import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import { getOnlineUsers, getUserById, setUserState, UserState } from "../../models/user";
import ChatMessageEmitter from "../Emitter/ChatMessageEmitter";
import { gameOver, getMatchById } from "../../models/match/match";
import { StateChangeEmitter } from "../Emitter/StateChangeEmitter";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class MatchLeftListener extends Listener {

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(ios: Server, client: Socket) {
        super(client, 'match-left');
        this.ios = ios;
    }
    //TODO testare funzionamento
    listen(): void {
        super.listen(async (data) => {
            try{
            const { match, userId } = data;
            if (match) {
                if (data.surrender) {
                    const matchData = await getMatchById(match._id);
                    const winner = matchData.playerOne.userId == userId ? matchData.playerTwo : matchData.playerOne;
                    const loser = matchData.playerOne.userId == userId ? matchData.playerOne : matchData.playerTwo;
                    await gameOver.bind(matchData)(winner, loser);
                }
                this.client.leave(match._id);
                const userState = userId == match.playerOne.userId || userId == match.playerTwo.userId ? UserState.Playing : UserState.Observing
                if (userState == UserState.Playing) {
                    this.client.leave(match.playersChat);
                    const userOnline = await getOnlineUsers();
                    const user = await getUserById(userId);
                        userOnline.forEach((u) => {
                            const stateEmitter = new StateChangeEmitter(this.ios, u._id);
                            stateEmitter.emit({ userId, username: user.username, state: UserState.Online, stats: user.stats });
                            console.log(
                                " O MAMMAMIA ABBIAMO EMITTATO LO STATO LEFTATO DEL UAGLIONE " + (userId.toString()).magenta + " al suo amichetto" + (u.username).magenta
                            )
                        })
                } else {
                    this.client.leave(match.observerChat);
                }
                await setUserState(userId, UserState.Online);
            }
        }catch(err){
            console.log(err);
        }
        });
    }
}

