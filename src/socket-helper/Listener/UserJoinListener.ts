import { Server, Socket } from "socket.io";
import { ChatInterface, ChatModel } from "../../models/chat";
import { Model, Types } from "mongoose";

import { Listener } from "./Listener";
import { setUserState, UserState } from "../../models/user";
export class UserJoinListener extends Listener {

    public readonly ios: Server;
    public readonly chat: Model<ChatInterface>;
    constructor(client: Socket) {
        super(client, 'user-join');

    }

    listen(): void {
        super.listen(async (userId: string) => {
            try {
                this.client.join(userId);
                console.log("User Joined the server: " + userId);
                await setUserState(new Types.ObjectId(userId), UserState.Online);
            } catch (err) {
                console.log(err);
            }
        })
    }

}