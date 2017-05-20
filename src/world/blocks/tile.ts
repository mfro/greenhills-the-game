import * as pixi from 'pixi.js';
import * as blocks from 'world/blocks';
import Vector from 'math/vector';

import Material from './material';

class BlockTile {
    public readonly material: Material;
    public readonly sprite: pixi.Sprite;

    public readonly position: Vector;

    constructor(material: Material, pos: Vector) {
        this.material = material;
        this.position = pos;

        this.sprite = new pixi.Sprite();
        this.sprite.position = this.position.toPoint();
        this.sprite.width = 1;
        this.sprite.height = 1;
        this.sprite.texture = new pixi.Texture(material.texture.baseTexture, new pixi.Rectangle(0, 0, 64, 64));
    }

    public update() {
        let topTile = blocks.getTile(this.position.x, this.position.y - 1);
        let leftTile = blocks.getTile(this.position.x - 1, this.position.y);
        let rightTile = blocks.getTile(this.position.x + 1, this.position.y);
        let bottomTile = blocks.getTile(this.position.x, this.position.y + 1);

        let top = topTile && topTile.material == this.material;
        let left = leftTile && leftTile.material == this.material;
        let right = rightTile && rightTile.material == this.material;
        let bottom = bottomTile && bottomTile.material == this.material;

        let coord: Vector;

        if (top && left && right && bottom)
            coord = new Vector(1, 1);

        else if (left && right && bottom)
            coord = new Vector(1, 0);

        else if (top && right && bottom)
            coord = new Vector(0, 1);

        else if (top && left && bottom)
            coord = new Vector(2, 1);

        else if (top && left && right)
            coord = new Vector(1, 2);

        else if (top && left)
            coord = new Vector(2, 2);

        else if (top && right)
            coord = new Vector(0, 2);

        else if (top && bottom)
            coord = new Vector(3, 1);

        else if (left && right)
            coord = new Vector(1, 3);

        else if (left && bottom)
            coord = new Vector(2, 0);

        else if (right && bottom)
            coord = new Vector(0, 0);

        else if (top)
            coord = new Vector(3, 2);

        else if (left)
            coord = new Vector(2, 3);

        else if (right)
            coord = new Vector(0, 3);

        else if (bottom)
            coord = new Vector(3, 0);

        else
            coord = new Vector(3, 3);

        this.sprite.texture.frame = new pixi.Rectangle(coord.x * 64, coord.y * 64, 64, 64);
    }
}

export default BlockTile;