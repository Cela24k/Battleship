import { Router } from "express";
import { Types } from "mongoose";
import { getMatchById } from "../models/match/match";

export const router = Router();

router.patch('/:matchId/move', async (req, res) => {
    const { userId, shot } = req.body;
    const matchId = req.params.matchId;

    try {
        var match = await getMatchById(new Types.ObjectId(matchId));
        match.makePlayerMove(new Types.ObjectId(userId), shot);
        res.status(200).json(match);
    } catch (err) {
        if (err === 'Server Error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }

})

router.post(':matchId/init', async (req, res) => {
    const { userId, shot } = req.body;
    const matchId = req.params.matchId;
})
 