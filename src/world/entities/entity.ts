import * as pixi from 'pixi.js';

import Vector from 'math/vector';

import { EventEmitter } from 'eventemitter3';

interface Events {
    idle: void;
    move: Vector;
    update: number;

    removed: void;
}

class Entity extends EventEmitter<Events> {
    public readonly container = new pixi.Container();
    
    private _position: Vector;

    constructor(position: Vector) {
        super();
        
        this.position = position;
        
        // let graphics = new pixi.Graphics();

        // graphics.beginFill(0xFF0000, 1);
        // graphics.drawCircle(0, 0, 0.45);
        // graphics.endFill();

        // this.container.addChildAt(graphics, 0);
    }

    public get position() { return this._position; }
    public set position(v: Vector) {
        this._position = v;
        this.container.position = this._position.toPoint();
        
        this.emit('move', this.position);
    }

    public update(dT: number) {
        this.emit('update', dT);
    }
}

export default Entity;
