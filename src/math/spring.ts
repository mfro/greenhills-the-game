import Point from 'math/vector';

namespace Spring {
    export class Number {
        private _value: number;

        public get value() { return this._value; }
        public target: number;

        constructor(value: number) {
            this._value = value;
            this.target = value;
        }

        public update() {
            let diff = this.target - this.value;
            this._value += diff / 5;
        }
    }

    export class Vector {
        private _value: Point;

        public get value() { return this._value; }
        public target: Point;

        constructor(value: Point)
        constructor(x: number, y: number)
        constructor(x: number | Point, y?: number) {
            if (x instanceof Point)
                this._value = this.target = x;
            else
                this._value = this.target = new Point(x, y);
        }

        public update() {
            let diff = this.target.add(this.value.scale(-1));

            this._value = this.value.add(diff.scale(0.2));
        }
    }
}

export default Spring;