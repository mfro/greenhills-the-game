import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Material from '../material';

interface BlockMaterial extends Material {
    texture: pixi.Texture;
    isSolid: boolean;
    isWall: boolean;
}

namespace BlockMaterial {
    interface Definition extends Material.Definition {
        isSolid: boolean;
        isWall: boolean;
        texture: string;
    }

    function define(def: Definition): BlockMaterial {
        let material = Object.assign(Material.define(def), {
            isSolid: def.isSolid,
            isWall: def.isWall,
            texture: texture.placeholder,
        });

        texture.load(def.texture, atlas => {
            material.texture = atlas;
            material.thumbnail = new pixi.Texture(atlas.baseTexture, new pixi.Rectangle(192, 192, 64, 64));
        });

        return material;
    }

    export const CONCRETE = define({
        id: 'CONCRETE',
        texture: 'walls/concrete.png',
        type: Material.Type.Wall,
        
        isSolid: true,
        isWall: true,
        isPlaceable: true,
    });
}

export default BlockMaterial;