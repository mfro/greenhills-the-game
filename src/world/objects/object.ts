import * as pixi from 'pixi.js';

import * as materials from 'world/materials';

import Vector from 'math/vector';
import { EventEmitter } from 'eventemitter3';

interface Events {

}

abstract class GameObject extends EventEmitter<Events> {
    public readonly position: Vector;
    public readonly container = new pixi.Container();
    public readonly size: Vector;

    public readonly direction: Vector;
    public readonly material: materials.Object;

    protected readonly sprite = new pixi.Sprite();

    constructor(material: materials.Object, position: Vector, direction: Vector) {
        super();

        this.material = material;

        this.position = position;
        this.direction = direction;
        this.size = new Vector(
            this.direction == Vector.up || this.direction == Vector.down ? material.width : material.height,
            this.direction == Vector.up || this.direction == Vector.down ? material.height : material.width
        );

        this.container.position = this.position.toPoint();

        this.sprite.texture = this.material.getTexture(direction);
        this.sprite.width = this.size.x;
        this.sprite.height = this.size.y;

        this.container.addChildAt(this.sprite, 0);
    }
}

namespace GameObject {
    export interface Constructor {
        new (pos: Vector, direction: Vector): GameObject;
    }
}

export default GameObject;