import { Router } from "express";
import { createTicket, removeTicket } from "../models/ticket-entry";
import { parseJwt } from "./user-routes";

export const router = Router();
//TODO need to be tested
router.post('/join', async (req, res) => {
    const userId = req.body.userId;
    const jwt = parseJwt(req.headers.authorization);
    try {
        if(jwt['_id'] == userId){
            const ticket = await createTicket(userId);
            return res.status(200).json(ticket);
        }
        throw new Error("Can't respond at your request");
        
    } catch (err) {
        if (err === 'Server error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})

router.delete('/remove', async (req, res) => {
    const userId = req.body.userId;
    const jwt = parseJwt(req.headers.authorization);
    try {
        if(jwt['_id'] == userId){
            await removeTicket(userId);
            return res.status(200).json("Ticket removed from the matchamking queue.");
        }
        throw new Error("Can't respond at your request");
    } catch (err) {
        if (err === 'Server error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})