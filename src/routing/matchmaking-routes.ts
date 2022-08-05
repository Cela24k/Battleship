import { Router } from "express";
import { createTicket } from "../models/ticket-entry";

export const router = Router();
//TODO need to be tested
router.post('/join', async (req, res)=>{
    const userId = req.body.userId;
    try{
        const ticket = await createTicket(userId);
        //TODO here must be the main swag feat. We need to cereate an Interval that begins the matchmaking phase. We can create some helper functions for the logic of searching an opponent and when it's finded we should emit in the socket the searchingmatch.
        return res.status(200).json(ticket);
    }catch(err){
        if (err === 'Server error')
        return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
    else
        return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})