import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Vector from 'math/vector';

let rsrc = require.context('../../../resources', true, /\.png$/);

abstract class Material {
    public readonly id: string;
    public thumbnail: pixi.Texture;

    constructor(def: Material.Definition) {
        this.id = def.id;
        this.thumbnail = texture.placeholder;

        Material.allMaterials.push(this);
    }

    public abstract getTexture(pos: Vector): pixi.Texture;
    public abstract isPlaceable(pos: Vector): boolean;
}

export default Material;

namespace Material {
    export const allMaterials = Array<Material>();

    export interface Definition {
        id: string;
        // isPlaceable: boolean;
    }
}
