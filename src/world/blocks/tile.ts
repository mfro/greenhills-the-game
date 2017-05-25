import * as pixi from 'pixi.js';
import * as blocks from 'world/blocks';
import * as materials from 'world/materials';

import Vector from 'math/vector';

class BlockTile {
    public readonly material: materials.Block;
    public readonly sprite: pixi.Sprite;

    public readonly position: Vector;

    constructor(material: materials.Block, pos: Vector) {
        this.material = material;
        this.position = pos;

        this.sprite = new pixi.Sprite();

        let padding = 1 / 33 / 4;
        
        this.sprite.position = this.position.apply(v => v - padding).toPoint();
        this.sprite.width = 1 + padding * 2;
        this.sprite.height = 1 + padding * 2;

        this.update();
    }

    public update() {
        this.sprite.texture = this.material.getTexture(this.position);

        this.material.update(this);
    }
}

export default BlockTile;