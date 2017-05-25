import * as pixi from 'pixi.js';

import * as app from 'app';

import Vector from 'math/vector';
import { EventEmitter } from 'eventemitter3';

interface Events {
    update: void;
}

const tileSize = 60;

abstract class ToolbarItem extends EventEmitter<Events> {
    public readonly container = new pixi.Container();
    
    private _position: Vector;
    public get position() { return this._position; }
    public set position(v: Vector) {
        this._position = v;

        this.container.position = v.toPoint();
    }

    public abstract click(): void;
    public abstract update(): void;

    public static readonly height = 48;
    public static readonly width = 300;
}

export default ToolbarItem;