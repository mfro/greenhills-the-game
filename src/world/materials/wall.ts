import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as blocks from 'world/blocks';
import * as objects from 'world/objects';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';

import Material from './material';
import BlockMaterial from './block';

class WallMaterial extends BlockMaterial {
    private _atlas: pixi.Texture;
    private _indoor: boolean;
    private _outdoor: boolean;

    constructor(def: WallMaterial.Definition) {
        super(def);

        this._indoor = def.indoor;
        this._outdoor = def.outdoor;

        if (typeof def.texture == 'string')
            texture.load(def.texture, atlas => {
                this._atlas = atlas;
                this.thumbnail = new pixi.Texture(atlas.baseTexture, new pixi.Rectangle(33 * 3, 33 * 3, 33, 33));
            });
        else {
            this._atlas = def.texture;
            this.thumbnail = new pixi.Texture(this._atlas.baseTexture, new pixi.Rectangle(33 * 3, 33 * 3, 33, 33));
        }
    }

    public isPlaceable(pos: Vector): boolean {
        let floor = foundations.getTile(pos);
        let obj = objects.getObject(pos);

        return !obj && ((floor.material.isIndoor && this._indoor) || (!floor.material.isIndoor && this._outdoor));
    }

    public getTexture(pos: Vector): pixi.Texture {
        let top = blocks.getTile(pos.x, pos.y - 1).material == this;
        let left = blocks.getTile(pos.x - 1, pos.y).material == this;
        let right = blocks.getTile(pos.x + 1, pos.y).material == this;
        let bottom = blocks.getTile(pos.x, pos.y + 1).material == this;

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
            coord = new Vector(3, 0);

        else if (left && right)
            coord = new Vector(0, 3);

        else if (left && bottom)
            coord = new Vector(2, 0);

        else if (right && bottom)
            coord = new Vector(0, 0);

        else if (top)
            coord = new Vector(3, 0);

        else if (left)
            coord = new Vector(0, 3);

        else if (right)
            coord = new Vector(0, 3);

        else if (bottom)
            coord = new Vector(3, 0);

        else
            coord = new Vector(3, 3);

        let frame = new pixi.Rectangle(coord.x * 33, coord.y * 33, 33, 33);

        return new pixi.Texture(this._atlas.baseTexture, frame);
    }
}

namespace WallMaterial {
    export interface Definition extends BlockMaterial.Definition {
        texture: string;
        indoor: boolean;
        outdoor: boolean;
    }
}

export default WallMaterial;