import { Router } from "express";
import { createTicket, removeTicket } from "../models/ticket-entry";

export const router = Router();
//TODO need to be tested
router.post('/join', async (req, res) => {
    const userId = req.body.userId;
    try {
        const ticket = await createTicket(userId);
        return res.status(200).json(ticket);
    } catch (err) {
        if (err === 'Server error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})

router.delete('/remove', async (req, res) => {
    const userId = req.body.userId;
    try {
        await removeTicket(userId);
        return res.status(200).json("Ticket removed from the matchamking queue.");
    } catch (err) {
        if (err === 'Server error')
            return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
        else
            return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})