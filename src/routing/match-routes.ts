import { Router } from "express";
import { Types } from "mongoose";
import ios from "..";
import { getMatchById, Match } from "../models/match/match";
import InitBoardEmitter from "../socket-helper/Emitter/InitBoardEmitter";
import MatchTurnEmitter from "../socket-helper/Emitter/MatchTurnEmitter";
import { parseJwt } from "./user-routes";

export const router = Router();

router.get('', async (req, res) => {
    try {
        var match = await Match.find({});
        res.status(200).json(match);
    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})

router.patch('/:matchId', async (req, res) => {
    const action = req.query.action;
    const { userId, shot } = req.body;
    const matchId: any = req.params.matchId;
    const jwt = parseJwt(req.headers.authorization);

    try {
        if (jwt['_id'] == userId) {
            
        }else{
            var match = await getMatchById(matchId);
            var dataFired = await match.makePlayerMove(userId, shot);
            const turnEmitter = new MatchTurnEmitter(ios, matchId);
            turnEmitter.emit({ gameTurn: dataFired[1], shot: dataFired[0], userId });
            res.status(200).json(dataFired);
        }
        throw new Error("Can't respond at your request");

        if (action != "move")
            throw new Error("Endpoint not found");
    } catch (err) {
        console.log(err);
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else {
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });

        }
    }

})

router.post('/:matchId', async (req, res) => {
    const action = req.query.action;
    const { userId, board } = req.body;
    const matchId = req.params.matchId;
    const jwt = parseJwt(req.headers.authorization);
    try {
        if (jwt['_id'] == userId) {
            if (action != "init")
                throw new Error("Endpoint not found");
            var match = await getMatchById(new Types.ObjectId(matchId));
            match = await match.initBoardPlayer(userId, board);
            if (match.arePlayersReady()) {
                const turnEmitter = new MatchTurnEmitter(ios, (match._id).toString());
                turnEmitter.emit({ gameTurn: match.gameTurn });
                console.log("MatchInizializzzto".america);
            }
            res.status(200).json(match);
        }else{
            throw new Error("Can't respond at your request");
        }

    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})



