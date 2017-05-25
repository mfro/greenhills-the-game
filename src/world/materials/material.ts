import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Vector from 'math/vector';

let rsrc = require.context('../../../resources', true, /\.png$/);

abstract class Material {
    public readonly id: string;
    public readonly name: string;
    public readonly cost: number;
    
    public thumbnail: pixi.Texture;

    constructor(def: Material.Definition) {
        this.id = def.id;
        this.name = def.name;
        this.cost = def.cost;
        
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
        name: string;
        cost: number;
    }
}
