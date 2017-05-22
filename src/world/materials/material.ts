import * as pixi from 'pixi.js';
import * as texture from 'texture';

import Vector from 'math/vector';

import WallMaterial from './wall';
import BlockMaterial from './block';
import PlainBlockMaterial from './plainBlock';

import FoundationMaterial from './foundation';

let rsrc = require.context('../../../resources', true, /\.png$/);

abstract class Material {
    public readonly id: string;
    public readonly isPlaceable: boolean;

    public thumbnail: pixi.Texture;

    constructor(def: Material.Definition) {
        this.id = def.id;
        this.isPlaceable = def.isPlaceable;

        this.thumbnail = texture.placeholder;

        Material.allMaterials.push(this);
    }

    public abstract getTexture(pos: Vector): pixi.Texture;
}

export default Material;

namespace Material {
    export const allMaterials = Array<Material>();

    export interface Definition {
        id: string;
        isPlaceable: boolean;
    }

    export type Block = BlockMaterial;
    export const Block = require('./block').default as typeof BlockMaterial;

    export type Wall = WallMaterial;
    export const Wall = require('./wall').default as typeof WallMaterial;

    export type PlainBlock = PlainBlockMaterial;
    export const PlainBlock = require('./plainBlock').default as typeof PlainBlockMaterial;

    export type Foundation = FoundationMaterial;
    export const Foundation = require('./foundation').default as typeof FoundationMaterial;

    export const CONCRETE_WALL = new Wall({
        id: 'CONCRETE_WALL',
        texture: 'walls/concrete.png',

        isSolid: true,
        isPlaceable: true,
    });

    export const AIR = new PlainBlock({
        id: 'AIR',
        texture: texture.transparent,

        isSolid: false,
        isPlaceable: false
    });

    export const DIRT = new Foundation({
        id: 'DIRT',
        texture: 'floors/dirt.png',

        isPlaceable: false
    });

    export const GRASS = new Foundation({
        id: 'GRASS',
        texture: 'floors/grass.png',

        isPlaceable: true,
    });

    export const CONCRETE_FLOOR = new Foundation({
        id: 'CONCRETE_FLOOR',
        texture: 'floors/concrete.png',

        isIndoor: true,
        isPlaceable: true
    });
}
