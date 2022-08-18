export interface BattleGrid{
    //TODO vedere in che modo implementarla, vogliamo implementare una grid 10x10 e la logica si basera su tutta la griglia, oppure vogliamo 
    //      un semplice array di coordinate, contenti le barche e quindi basare la logica solo sulle coordinate delle barchette.
    //      il primo metodo penso sia comodo per i colpi sparati (spari un colpo, vedi nella grid se in quella posizione ci sta una barca)
    //      IL secondo penso sia comodo per vedere se uno e' vincitore, bisognerebbe solo ciclare l'array di coordinate/barche.
    playableGrid : Coordinates[],
    shipPosition : Ship[];
    
}

enum CellType {
    Empty,
    Hit,
    Miss
}
export interface Coordinates{
    row : number,
    col : number,
    cellType : CellType
}