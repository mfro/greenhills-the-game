import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Vector from 'math/vector';

let rsrc = require.context('../../resources', true, /\.png$/);

abstract class Material {
    public readonly id: string;
    public readonly type: Material.Type;
    public readonly isPlaceable: boolean;

    public thumbnail: pixi.Texture;

    constructor(def: Material.Definition) {
        this.id = def.id;
        this.type = def.type;
        this.isPlaceable = def.isPlaceable;

        this.thumbnail = texture.placeholder;

        Material.allMaterials.push(this);
    }

    public abstract getTexture(pos: Vector): pixi.Texture;
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

    // export function define(def: Definition): Material {
    //     let material = {
    //         id: def.id,
    //         type: def.type,
    //         isPlaceable: def.isPlaceable,
    //         thumbnail: texture.placeholder,
    //     };

    //     allMaterials.push(material);

    //     return material;
    // }

    export const allMaterials = Array<Material>();
}

export default Material;