import { Router } from "express";
import { createTicket } from "../models/ticket-entry";

export const router = Router();
//TODO need to be tested
router.post('/matchmaking/join', async (req, res)=>{
    const userId = req.body.userId;
    try{
        await createTicket(userId);
        return res.status(200).json("Queue joined bello!");
    }catch(err){
        if (err === 'Server error')
        return res.status(500).json({ error: true, errormessage: err, timestamp: Date.now() });
    else
        return res.status(404).json({ error: true, errormessage: err, timestamp: Date.now() });
    }
})