import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Material from '../material';

interface Definition extends Material.Definition {
    isIndoor?: boolean;

    texture: string;
}

class FoundationMaterial extends Material {
    public readonly isIndoor: boolean;

    private _textures: Array<pixi.Texture>;

    constructor(def: Definition) {
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
    export const DIRT = new FoundationMaterial({
        id: 'DIRT',
        texture: 'floors/dirt.png',
        type: Material.Type.Foundation,

        isPlaceable: false
    });

    export const GRASS = new FoundationMaterial({
        id: 'GRASS',
        texture: 'floors/grass.png',
        type: Material.Type.Foundation,

        isPlaceable: true,
    });

    export const CONCRETE = new FoundationMaterial({
        id: 'CONCRETE',
        texture: 'floors/concrete.png',
        type: Material.Type.Foundation,

        isIndoor: true,
        isPlaceable: true
    });
}

export default FoundationMaterial;