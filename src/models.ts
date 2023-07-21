export type Value = number;
export class Matrix extends Array<Array<Value>> {

    private constructor(n: number, m: number) {
        super(n);
        this.fill(null);
        this.forEach((_, i, mat) => mat[i] = Array(m).fill(0))
    }

    public static create(n: number, m: number): Matrix {
        return new Matrix(n, m);
    }

    public each( cb: (i: number, j: number, item: Value, origin: Matrix)=> Value): Matrix {
        this.forEach( (row, rowN) => row.forEach( (cell, colN) => row[colN] = cb(rowN, colN, cell, this)) );
        return this;
    }

    public override toString(): string {
        return "[" + this.map( row => (row as Vector).toString()).join(",\n") + "]";
    }
}

export class Vector extends Array<Value> {

    private constructor(n: number){
        super(n);
        this.fill(0);
    }

    public static create(n: number): Vector {
        return new Vector(n);
    }

    public static from(origin: Array<Value>): Vector {
        return Vector.create(origin.length).each( i=> origin[i]);
    }

    public each( cb: (index: number, item: Value, origin: Vector) => Value): Vector {
        this.forEach( (it, i, arr) => arr[i] = cb(i, it, this));
        return this;
    }

    public override toString(): string {
        return "[" + this.map(value => value.toFixed(5)).join(", ") + "]";
    }
}
