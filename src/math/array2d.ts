import Vector from './vector';

class Array2D<T> {
    private _array = new Array<T>();

    public readonly xSize: number;
    public readonly ySize: number;

    public constructor(xSize: number, ySize: number) {
        this.xSize = xSize;
        this.ySize = ySize;
    }

    public get(point: Vector): T
    public get(x: number, y: number): T
    public get(a: Vector | number, b?: number): T {
        let x: number, y: number;

        if (a instanceof Vector) {
            x = a.x;
            y = a.y;
        } else {
            x = a;
            y = b;
        }

        if (x < 0 || x >= this.xSize ||
            y < 0 || y >= this.ySize)
            return null;

        return this._array[x * this.xSize + y];
    }

    public set(point: Vector, value: T): void
    public set(x: number, y: number, value: T): void
    public set(a: Vector | number, b: T | number, c?: T): void {
        let x: number, y: number;
        let v: T;

        if (arguments.length == 2) {
            x = (a as Vector).x;
            y = (a as Vector).y;
            v = b as T;
        } else {
            x = a as number;
            y = b as number;
            v = c as T;
        }

        this._array[x * this.xSize + y] = v;
    }
}

export default Array2D;