import { Point } from 'pixi.js';

export default class Vector {
    public readonly x: number;
    public readonly y: number;

    public constructor(x = 0, y = 0) {
        this.x = Math.round(x * 10000) / 10000;
        this.y = Math.round(y * 10000) / 10000;
    }

    public get direction() { return Math.atan2(this.y, this.x); }
    public get length() { return Math.sqrt(this.x * this.x + this.y * this.y); }

    public toPoint() { return new Point(this.x, this.y); }

    public norm() {
        return Vector.polar(this.direction, 1);
    }

    public apply(map: (v: number) => number) {
        return new Vector(map(this.x), map(this.y));
    }

    public add(x: number, y: number): Vector;
    public add(v: Vector): Vector;
    public add(a: number | Vector, b?: number) {
        let x: number, y: number;
        if (arguments.length == 1)
            x = (a as Vector).x, y = (a as Vector).y;
        else
            x = a as number, y = b;
        
        return new Vector(this.x + x, this.y + y);
    }

    public scale(s: number) {
        return new Vector(this.x * s, this.y * s);
    }

    public toString() {
        return '(' + this.x + ',' + this.y + ')';
    }

    public equals(v: Vector) {
        return this.x == v.x && this.y == v.y;
    }

    private static _zero = new Vector();
    public static get zero() { return Vector._zero; }

    public static polar(dir: number, mag: number) {
        return new Vector(mag * Math.cos(dir), mag * Math.sin(dir));
    }

    public static min(v1: Vector, v2: Vector) {
        return v1.length > v2.length ? v2 : v1;
    }
}
