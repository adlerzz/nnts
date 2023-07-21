import { Matrix, Value, Vector } from './models';

const Al = 3;
const Ml = 5;
const Yl = 3;

const learningRate = 0.05;
const maxEpochs = 10000000;

const dataset = [
    {input: [0,0,0], res: [0/8, 0, 0/3], learn: true},
    {input: [0,0,1], res: [1/8, 1, 1/3], learn: false},
    {input: [0,1,0], res: [2/8, 1, 1/3], learn: true},
    {input: [0,1,1], res: [3/8, 0, 2/3], learn: false},
    {input: [1,0,0], res: [4/8, 1, 1/3], learn: true},
    {input: [1,0,1], res: [5/8, 0, 2/3], learn: true},
    {input: [1,1,0], res: [6/8, 0, 2/3], learn: true},
    {input: [1,1,1], res: [7/8, 1, 3/3], learn: true},
].map(e => ({input: Vector.from(e.input), res: Vector.from(e.res), learn: e.learn}));

class NeuralNetwork {
    private readonly A: Vector;
    private readonly w: Matrix;
    private readonly M: Vector;
    private readonly deltaM: Vector;
    private readonly v: Matrix;
    private readonly Y: Vector;
    private readonly deltaY: Vector;
    private epoch: number;

    constructor(Al: number, Ml: number, Yl: number){
        this.A = Vector.create(Al);
        this.w = Matrix.create(Al, Ml).each( () => initWeight());
        this.M = Vector.create(Ml);
        this.deltaM = Vector.create(Ml);
        this.v = Matrix.create(Ml, Yl).each( () => initWeight());
        this.Y = Vector.create(Yl);
        this.deltaY = Vector.create(Yl);
        this.epoch = 0;
    }

    public input(data: Vector): void {
        this.A.each( i => data[i]);
        this.M.each( j => sigmoid( S(this.A.length, i => this.A[i]*this.w[i][j]) ));
        this.Y.each( j => sigmoid( S(this.M.length, i => this.M[i]*this.v[i][j]) ));
    }

    public output(): Vector {
        return this.Y;
    }

    public backPropagation(t: Vector): void {
        this.deltaY.each(iY => - dSigmoid(this.Y[iY]) * (t[iY] - this.Y[iY]));
        this.deltaM.each(iM => dSigmoid(this.M[iM]) * S(this.Y.length, iY => this.deltaY[iY] * this.v[iM][iY]));

        this.v.each( (iM, iY, v: Value) => v - learningRate * 0.5 * this.deltaY[iY] * this.M[iM]);
        this.w.each( (iA, iM, w: Value) => w - learningRate * 0.5 * this.deltaM[iM] * this.A[iA]);
    }

    public incEpoch(){
        this.epoch++;
    }

    public show(): void {
        if(this.epoch % (maxEpochs / 20) === 0){
            console.log({epoch: this.epoch, w: this.w, v: this.v});
        }
    }
}

function initWeight(): Value {
    return 0.1*(Math.random() - 0.5);
}

function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
}

function dSigmoid(y: number): number {
    return y * (1 - y);
}

function S(count: number, cb: (index: number) => number): number {
    let sum = 0;
    for(let i= 0; i<count; i++){
        sum += cb(i);
    }
    return sum;
}

function pretty(matrix: Matrix) {
    return matrix.map( row => "[" + row.map( value => value.toFixed(5)).join(", ") + "]" );
}
/*
const nn = new NeuralNetwork(Al, Ml, Yl);
nn.show();
for (let i = 0; i< maxEpochs; i++){
    dataset
        //.filter(s => s.learn)
        .forEach( s => {
            nn.input(s.input);
            nn.backPropagation(s.res);
        });
    nn.incEpoch();
    nn.show();
}

dataset.forEach( s => {
    nn.input(s.input);
    console.log(s.input, nn.output());
});
*/

console.log(Vector.from([1,2,3,4,5]).toString());
