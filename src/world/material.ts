import * as pixi from 'pixi.js';
import * as texture from 'texture';

let rsrc = require.context('../../resources', true, /\.png$/);

interface Material {
    id: string;
    type: Material.Type;
    isPlaceable: boolean;
    thumbnail: pixi.Texture;
}

namespace Material {
    export enum Type {
        Foundation,
        Block,
        Wall,
        Object,
    }

    export interface Definition {
        id: string;
        type: Type;
        isPlaceable: boolean;
    }

    export function define(def: Definition): Material {
        let material = {
            id: def.id,
            type: def.type,
            isPlaceable: def.isPlaceable,
            thumbnail: texture.placeholder,
        };

        allMaterials.push(material);

        return material;
    }

    export const allMaterials = Array<Material>();
}

export default Material;