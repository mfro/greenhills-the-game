import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as blocks from 'world/blocks'

import Vector from 'math/vector';

import Material from '../material';

interface Definition extends Material.Definition {
    isSolid: boolean;
    texture: string | pixi.Texture;
}

abstract class BlockMaterial extends Material {
    public readonly isSolid: boolean;
    public readonly isWall: boolean;

    constructor(isWall: boolean, def: Definition) {
        super(def);

        this.isSolid = def.isSolid;
        this.isWall = isWall;
    }
}

class WallMaterial extends BlockMaterial {
    private _atlas: pixi.Texture;

    constructor(def: Definition) {
        super(true, def);

        if (typeof def.texture == 'string')
            texture.load(def.texture, atlas => {
                this._atlas = atlas;
                this.thumbnail = new pixi.Texture(atlas.baseTexture, new pixi.Rectangle(192, 192, 64, 64));
            });
        else {
            this._atlas = def.texture;
            this.thumbnail = new pixi.Texture(this._atlas.baseTexture, new pixi.Rectangle(192, 192, 64, 64));
        }
    }

    public getTexture(pos: Vector) {
        let top = blocks.getTile(pos.x, pos.y - 1).material == this;
        let left = blocks.getTile(pos.x - 1, pos.y).material == this;
        let right = blocks.getTile(pos.x + 1, pos.y).material == this;
        let bottom = blocks.getTile(pos.x, pos.y + 1).material == this;

        // let top = topTile && topTile.material == this;
        // let left = leftTile && leftTile.material == this;
        // let right = rightTile && rightTile.material == this;
        // let bottom = bottomTile && bottomTile.material == this;

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

        let frame = new pixi.Rectangle(coord.x * 64, coord.y * 64, 64, 64);

        return new pixi.Texture(this._atlas.baseTexture, frame);
    }
}

class BoringMaterial extends BlockMaterial {
    private _texture: pixi.Texture;

    constructor(def: Definition) {
        super(false, def);

        if (typeof def.texture == 'string')
            texture.load(def.texture, atlas => {
                this.thumbnail = this._texture = atlas;
            });
        else {
            this.thumbnail = this._texture = def.texture;
        }
    }

    public getTexture(position: Vector) {
        return this._texture;
    }
}

namespace BlockMaterial {
    export const CONCRETE = new WallMaterial({
        id: 'CONCRETE',
        texture: 'walls/concrete.png',
        type: Material.Type.Wall,

        isSolid: true,
        isPlaceable: true,
    });

    export const AIR = new BoringMaterial({
        id: 'AIR',
        texture: texture.transparent,
        type: Material.Type.Block,

        isSolid: false,
        isPlaceable: false
    });
}

export default BlockMaterial;