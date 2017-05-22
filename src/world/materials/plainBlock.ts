import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as blocks from 'world/blocks';

import Vector from 'math/vector';
import Material from './material';
import BlockMaterial from './block';

class PlainBlockMaterial extends BlockMaterial {
    private _texture: pixi.Texture;

    constructor(def: PlainBlockMaterial.Definition) {
        super(def);

        if (typeof def.texture == 'string')
            texture.load(def.texture, atlas => {
                this.thumbnail = this._texture = atlas;
            });
        else {
            this.thumbnail = this._texture = def.texture;
        }
    }

    public getTexture(pos: Vector) {
        return this._texture;
    }
}

namespace PlainBlockMaterial {
    export interface Definition extends BlockMaterial.Definition {
        texture: string | pixi.Texture;
    }
}

export default PlainBlockMaterial;