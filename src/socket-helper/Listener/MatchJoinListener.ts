import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import { getOnlineUsers, getUserById, setUserState, UserState } from "../../models/user";
import ChatMessageEmitter from "../Emitter/ChatMessageEmitter";
import { StateChangeEmitter } from "../Emitter/StateChangeEmitter";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class MatchJoinedListener extends Listener {

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(ios: Server, client: Socket) {
        super(client, 'match-join');
        this.ios = ios;
    }

    listen(): void {
        super.listen(async (data) => {
            try {
                const { match, userId } = data;
                if (match) {
                    this.client.join(match._id);
                    console.log(match._id.rainbow);
                    const userState = userId == match.playerOne.userId || userId == match.playerTwo.userId ? UserState.Playing : UserState.Observing
                    await setUserState(userId, userState);
                    if (userState == UserState.Playing) {
                        this.client.join(match.playersChat);
                        const userOnline = await getOnlineUsers();
                        const user = await getUserById(userId);
                        console.log(userOnline);

                            userOnline.forEach((u) => {
                                const stateEmitter = new StateChangeEmitter(this.ios, u._id);
                                stateEmitter.emit({ userId, username: user.username, state: userState, stats: user.stats });
                                console.log(
                                    " O MAMMAMIA ABBIAMO EMITTATO LO STATO JOINATo DEL UAGLIONE " + (userId.toString()).magenta + " al suo amichetto" + (u.username).magenta
                                )
    
                            })
                    } else {
                        this.client.join(match.observerChat);
                    }
                }
            } catch (err) {
                console.log(err);
            }
        })
    }

}