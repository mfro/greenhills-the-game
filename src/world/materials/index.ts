import * as texture from 'texture';

import Material from './material';

import WallMaterial from './wall';
import BlockMaterial from './block';
import PlainBlockMaterial from './plainBlock';

import FoundationMaterial from './foundation';

import GrassMaterial from './types/grass';

export {
    Material as Base,

    WallMaterial as Wall,
    BlockMaterial as Block,
    PlainBlockMaterial as PlainBlock,
    FoundationMaterial as Foundation,
};

export const allMaterials = Material.allMaterials;

export const CONCRETE_WALL = new WallMaterial({
    id: 'CONCRETE_WALL',
    texture: 'walls/concrete.png',

    isSolid: true,
    indoor: true,
    outdoor: true,
});

export const AIR = new PlainBlockMaterial({
    id: 'AIR',
    texture: texture.transparent,

    isSolid: false,
});

export const DIRT = new FoundationMaterial({
    id: 'DIRT',
    texture: 'floors/dirt.png',
});

export const GRASS = new GrassMaterial();

export const CONCRETE_FLOOR = new FoundationMaterial({
    id: 'CONCRETE_FLOOR',
    texture: 'floors/concrete.png',

    isIndoor: true,
});
