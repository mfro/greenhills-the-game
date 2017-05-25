import * as pixi from 'pixi.js';

import * as gui from 'gui';
import * as app from 'app';
import * as mouse from 'input/mouse';

import * as world from 'world';

import Vector from 'math/vector';
import { EventEmitter } from 'eventemitter3';

interface Events {
    change: number
}

class Counter extends EventEmitter<Events> {
    public readonly container = new pixi.Container();

    public readonly position: Vector;
    public readonly label: string;
    public value = 0;

    private _text = new pixi.Text();

    constructor(pos: Vector, label: string) {
        super();

        this.label = label;

        this.position = pos;
        this.container.position = this.position.toPoint();

        let up = new pixi.Graphics();
        up.lineStyle(2, 0x000000, 0.8);
        up.moveTo(15, 5);
        up.lineTo(25, 15);
        up.lineTo(5, 15);
        up.lineTo(15, 5);
        up.position.set(0, 3);
        this.container.addChildAt(up, 1);

        let down = new pixi.Graphics();
        down.lineStyle(2, 0x000000, 0.8);
        down.moveTo(15, 15);
        down.lineTo(25, 5);
        down.lineTo(5, 5);
        down.lineTo(15, 15);
        down.position.set(0, 25);
        this.container.addChildAt(down, 1);

        this._text.position.set(35, 14);
        this._text.style.fontSize = 20;
        this.container.addChildAt(this._text, 1);

        app.hook('prerender', 'counter', () => this.render());
        mouse.on('down', 1, e => this.onMouse(e));
    }

    private render() {
        this._text.text = this.value + ' ' + this.label;
    }

    private onMouse(e: mouse.MouseButtonEvent) {
        if (e.position.x >= this.position.x && e.position.x < this.position.x + 30) {
            if (e.position.y > 48)
                return;

            e.handled = true;
            
            if (e.position.y < 24) {
                this.value++;
                this.emit('change', this.value);
            } else {
                if (this.value == 0) return;
                this.value--;
                this.emit('change', this.value);
            }
        }
    }
}

export default Counter;