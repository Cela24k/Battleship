import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model } from "mongoose";

import { Listener } from "./Listener";
import { setUserState, UserState } from "../../models/user";
//Questa classe servira a broadcastaare un messaggio all'interno della chat (roomId) che verra data dal client!? vedere come implementare
export class MatchJoinedListener extends Listener{

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;//TODO vorrei far diventare la chat un singleton anche se non dovrebbe servire
    constructor(ios: Server, client: Socket){
        super(client, 'match-join');
        this.ios = ios;
    }

    listen(): void {
        super.listen(async (data)=>{
            const {match, userId} = data;
            this.client.join(match._id);
            console.log(match._id.rainbow);
            const userState = userId == match.playerOne.userId || userId == match.playerTwo.userId?  UserState.Playing : UserState.Observing
            await setUserState(userId, userState);
        })
    }

}