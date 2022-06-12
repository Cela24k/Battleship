class Pair<T> {
    x: T
    y: T
    constructor(x:T,y:T){
        this.x = x;
        this.y = y;
    }

    invert(): Pair<T>{
        return new Pair(this.y,this.x);
    }
}