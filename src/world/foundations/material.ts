import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Material from '../material';

interface FoundationMaterial extends Material {
    isIndoor: boolean;

    textures: Array<pixi.Texture>;
}

namespace FoundationMaterial {
    interface Definition extends Material.Definition {
        isIndoor?: boolean;

        texture: string;
    }

    function define(def: Definition): FoundationMaterial {
        let material = Object.assign(Material.define(def), {
            isIndoor: def.isIndoor || false,
            textures: [texture.placeholder]
        });

        texture.load(def.texture, atlas => {
            material.textures.length = 0;

            for (let x = 0; x < atlas.width; x += 64) {
                for (let y = 0; y < atlas.height; y += 64) {
                    material.textures.push(new pixi.Texture(atlas.baseTexture, new pixi.Rectangle(x, y, 64, 64)));
                }
            }

            material.thumbnail = material.textures[0];
        });

        return material;
    }

    export const DIRT = define({
        id: 'DIRT',
        texture: 'floors/dirt.png',
        type: Material.Type.Foundation,

        isPlaceable: false
    });

    export const GRASS = define({
        id: 'GRASS',
        texture: 'floors/grass.png',
        type: Material.Type.Foundation,

        isPlaceable: true,
    });

    export const CONCRETE = define({
        id: 'CONCRETE',
        texture: 'floors/concrete.png',
        type: Material.Type.Foundation,
        
        isIndoor: true,
        isPlaceable: true
    });
}

export default FoundationMaterial;