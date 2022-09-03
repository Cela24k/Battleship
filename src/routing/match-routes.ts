import { Router } from "express";
import { Types } from "mongoose";
import { getMatchById, Match } from "../models/match/match";

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

    //TODO the problem is in the gameturn, lets find out, also there's a problem that if we join 2 times in a queue, it depends on which playerMatch are u if one or tweo, and u can create 2 match

    try {
        if (action != "move")
            throw new Error("Endpoint not found");
        var match = await getMatchById(matchId);
        await match.makePlayerMove(userId, shot);
        res.status(200).json(match);
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
    try {
        if (action != "init")
            throw new Error("Endpoint not found");
        var match = await getMatchById(new Types.ObjectId(matchId));
        await match.initBoardPlayer(userId, board);
        res.status(200).json(match);
    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})



