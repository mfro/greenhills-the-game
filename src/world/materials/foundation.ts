import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as blocks from 'world/blocks';

import Vector from 'math/vector';
import Material from './material';

class FoundationMaterial extends Material {
    public readonly isIndoor: boolean;

    private _textures: Array<pixi.Texture>;

    constructor(def: FoundationMaterial.Definition) {
        super(def);

        this.isIndoor = def.isIndoor || false;

        texture.load(def.texture, atlas => {
            this._textures = [];

            for (let x = 0; x < atlas.width; x += 64) {
                for (let y = 0; y < atlas.height; y += 64) {
                    this._textures.push(new pixi.Texture(atlas.baseTexture, new pixi.Rectangle(x, y, 64, 64)));
                }
            }

            this.thumbnail = this._textures[0];
        });
    }

    public getTexture() {
        let length = this._textures.length;
        let index = Math.floor(Math.random() * length);

        return this._textures[index];
    }
}

namespace FoundationMaterial {
    export interface Definition extends Material.Definition {
        isIndoor?: boolean;
        texture: string;
    }
}

export default FoundationMaterial;