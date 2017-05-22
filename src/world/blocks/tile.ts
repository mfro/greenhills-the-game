import * as pixi from 'pixi.js';
import * as blocks from 'world/blocks';
import Vector from 'math/vector';

import Material from 'world/materials';
import BlockMaterial from 'world/materials/block';

class BlockTile {
    public readonly material: BlockMaterial;
    public readonly sprite: pixi.Sprite;

    public readonly position: Vector;

    constructor(material: BlockMaterial, pos: Vector) {
        this.material = material;
        this.position = pos;

        this.sprite = new pixi.Sprite();
        this.sprite.position = this.position.toPoint();
        this.sprite.width = 1;
        this.sprite.height = 1;

        this.update();
    }

    public update() {
        this.sprite.texture = this.material.getTexture(this.position);
    }
}

export default BlockTile;