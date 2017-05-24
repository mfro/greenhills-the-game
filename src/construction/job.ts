import * as pixi from 'pixi.js';

import * as materials from 'world/materials';

import * as blocks from 'world/blocks';
import * as objects from 'world/objects';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import { EventEmitter } from 'eventemitter3';

export enum State {
    WAITING,
    ASSIGNED,
    CANCELLED,
    COMPLETED
}

interface Events {
    progress: void;
    state: void;
}

export abstract class Base extends EventEmitter<Events> {
    public readonly material: materials.Base;

    public readonly position: Vector;
    public readonly container = new pixi.Container();

    public readonly size: Vector;

    private _progress = 0;
    private _graphics = new pixi.Graphics();

    public get progress() { return this._progress; }
    public set progress(v: number) {
        this._progress = v;

        this._update();
        
        this.emit('progress');
    }

    private _state = State.WAITING;

    public get state() { return this._state; }
    public set state(s: State) {
        this._state = s;

        this.emit('state');
    }

    constructor(material: materials.Base, position: Vector, size: Vector) {
        super();

        this.material = material;
        this.position = position;
        this.size = size;

        this.container.position = position.toPoint();

        let sprite = new pixi.Sprite(material.getTexture(position));
        sprite.width = size.x;
        sprite.height = size.y;
        sprite.alpha = 0.5;

        this.container.addChildAt(sprite, 0);
        this.container.addChildAt(this._graphics, 1);

        this._update();
    }

    public abstract finish(): void;

    private _update() {
        this._graphics.clear();

        this._graphics.beginFill(0xFFFFFF, 0.5);
        this._graphics.drawRect(0, this.size.y * this.progress, this.size.x, this.size.y * (1 -this.progress));
        this._graphics.endFill();
    }
}

export class BuildBlock extends Base {
    constructor(material: materials.Block, position: Vector) {
        super(material, position, new Vector(1, 1));
    }

    public finish() {
        blocks.setTile(this.position.x, this.position.y, this.material as materials.Block);
    }
}

export class DemolishBlock extends BuildBlock {
    constructor(position: Vector) {
        super(materials.AIR, position);
    }
}

export class BuildFoundation extends Base {
    constructor(material: materials.Foundation, position: Vector) {
        super(material, position, new Vector(1, 1));
    }

    public finish() {
        foundations.setTile(this.position.x, this.position.y, this.material as materials.Foundation);
    }
}

export class BuildObject extends Base {
    public readonly direction: Vector;

    constructor(material: materials.Object, position: Vector, direction: Vector) {
        super(material, position, new Vector(
            direction == Vector.up || direction == Vector.down ? material.width : material.height,
            direction == Vector.up || direction == Vector.down ? material.height : material.width,
        ));

        this.direction = direction;
    }

    public finish() {
        let obj = new ((this.material as materials.Object).type)(this.position, this.direction);

        objects.addObject(obj);
    }
}
