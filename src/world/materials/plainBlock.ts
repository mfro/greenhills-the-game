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
                this._texture = atlas;
                if (!def.thumbnail)
                    this.thumbnail = atlas;
            });
        else {
            this.thumbnail = this._texture = def.texture;
        }

        if (def.thumbnail) {
            texture.load(def.thumbnail, atlas => {
                this.thumbnail = atlas;
            });
        }
    }

    public isPlaceable(pos: Vector) {
        return true;
    }

    public getTexture(pos: Vector) {
        return this._texture;
    }
}

namespace PlainBlockMaterial {
    export interface Definition extends BlockMaterial.Definition {
        texture: string | pixi.Texture;
        thumbnail?: string;
    }
}

export default PlainBlockMaterial;