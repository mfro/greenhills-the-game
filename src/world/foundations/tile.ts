import * as pixi from 'pixi.js';
import * as blocks from 'world/blocks';

import Vector from 'math/vector';

import Material from 'world/materials';
import FoundationMaterial from 'world/materials/foundation';

class FoundationTile {
    private _material: FoundationMaterial;
    private _sprite: pixi.Sprite;

    public readonly position: Vector;

    constructor(material: FoundationMaterial, pos: Vector) {
        this.position = pos;

        this._sprite = new pixi.Sprite();
        this.sprite.position = this.position.toPoint();
        this.sprite.width = 1;
        this.sprite.height = 1;

        this.material = material;
    }

    public get sprite() { return this._sprite; }

    public get material() { return this._material; }
    public set material(value: FoundationMaterial) {
        if (value == this.material) return;

        this._material = value;
        this._sprite.texture = value.getTexture();
    }

    public update() {
        if (this.material == Material.GRASS && blocks.getTile(this.position.x, this.position.y).material.isSolid) {
            this.material = Material.DIRT;
        }
    }
}

export default FoundationTile;