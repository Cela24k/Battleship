import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import { getOnlineUsers, getUserById, setUserState, UserState } from "../../models/user";
import ChatMessageEmitter from "../Emitter/ChatMessageEmitter";
import { StateChangeEmitter } from "../Emitter/StateChangeEmitter";
export class MatchJoinedListener extends Listener {

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;
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
                    const userState = userId == match.playerOne.userId || userId == match.playerTwo.userId ? UserState.Playing : UserState.Observing
                    await setUserState(userId, userState);
                    if (userState == UserState.Playing) {
                        this.client.join(match.playersChat);
                        const userOnline = await getOnlineUsers();
                        const user = await getUserById(userId);
                        userOnline.forEach((u) => {
                            const stateEmitter = new StateChangeEmitter(this.ios, (u.id).toString());
                            stateEmitter.emit({ userId, username: user.username, state: userState, stats: user.stats });
                            

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