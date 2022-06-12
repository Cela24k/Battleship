
class RoomFactory {
    static rooms : Map<Pair<String>,String> 
    static count: number
    constructor(){
        RoomFactory.rooms = new Map();
    }
    
    static getRoom(ids: Pair<String>): String {
        let p1 = RoomFactory.rooms.get(ids);
        let p2 = RoomFactory.rooms.get(ids.invert());
        if(p1)
            return p1;
        else if(p2)
            return p2;
        else {
            RoomFactory.rooms.set(new Pair(ids.x,ids.y),)
        }
    }
}