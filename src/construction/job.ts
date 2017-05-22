import * as pixi from 'pixi.js';

import Vector from 'math/vector';
import Material from 'world/materials';

class Job {
    public readonly material: Material;

    public readonly position: Vector;
    public readonly container = new pixi.Container();

    private _progress = 0;
    private _graphics = new pixi.Graphics();

    public get progress() { return this._progress; }
    public set progress(v: number) {
        this._progress = v;

        this._update();
    }

    constructor(material: Material, position: Vector) {
        this.material = material;
        this.position = position;

        this.container.position = position.toPoint();

        if (material != null) {
            let sprite = new pixi.Sprite(material.getTexture(position));
            sprite.width = 1;
            sprite.height = 1;
            sprite.alpha = 0.5;

            this.container.addChildAt(sprite, 0);
        }
        
        this.container.addChildAt(this._graphics, 1);

        this._update();
    }

    private _update() {
        this._graphics.clear();

        this._graphics.beginFill(0xFFFFFF, 0.5);
        this._graphics.drawRect(0, this.progress, 1, 1 - this.progress);
        this._graphics.endFill();
    }
}

export default Job;