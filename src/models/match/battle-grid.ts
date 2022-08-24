import { Schema } from "mongoose"
import { Cell, CellSchema } from "./cell"
import {Ship, ShipSchema} from "./ship"


export interface BattleGrid{
    //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
    //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
    //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
    //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.
    shots: Cell[], // Shots array for our "grid", the cells have a cellType(see in cell.ts) which helps us for the frontend
    shipPosition : Ship[],// Ships array that could be studied for the opponent shots.
    areAllShipsDestroyed : () => boolean,
}


export const BattleGridSchema = new Schema<BattleGrid>({
   shots: {
        type: [CellSchema],
        default: []
   },
   shipPosition:{
        type: [ShipSchema],
        default: []
   }
})

BattleGridSchema.methods.areAllShipsDestroyed = function(){
    this.ships.forEach((s: Ship)=>{
        if(!s.isDestroyed()){
            return false;
        }
    })
    return true;
}
