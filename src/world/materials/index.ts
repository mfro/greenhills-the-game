import * as texture from 'texture';

import Material from './material';

import WallMaterial from './wall';
import BlockMaterial from './block';
import PlainBlockMaterial from './plainBlock';

import FoundationMaterial from './foundation';

import ObjectMaterial from './object';

import GrassMaterial from './types/grass';

import Toilet from 'world/objects/toilet';
import Desk from 'world/objects/desk';
import WoodTable from 'world/objects/woodTable';

export {
    Material as Base,

    WallMaterial as Wall,
    BlockMaterial as Block,
    PlainBlockMaterial as PlainBlock,
    FoundationMaterial as Foundation,

    ObjectMaterial as Object,
};

export const allMaterials = Material.allMaterials;

export function getMaterial(id: string) {
    return allMaterials.find(m => m.id == id);
}

export const CINDERBLOCK_WALL = new WallMaterial({
    id: 'CINDERBLOCK_WALL',
    name: 'Cinderblock',
    texture: 'walls/cinderblock.png',

    isSolid: true,
    indoor: true,
    outdoor: true,
});

export const BRICK_WALL = new WallMaterial({
    id: 'BRICK_WALL',
    name: 'Brick',
    texture: 'walls/brick.png',

    isSolid: true,
    indoor: true,
    outdoor: true,
});

export const AIR = new PlainBlockMaterial({
    id: 'AIR',
    name: 'Remove walls',
    texture: texture.transparent,
    thumbnail: 'demolish.png',

    isSolid: false,
});


export const GRASS = new GrassMaterial();

export const DIRT = new FoundationMaterial({
    id: 'DIRT',
    name: 'Dirt',
    texture: 'floors/dirt.png',
});

export const WOOD_FLOOR = new FoundationMaterial({
    id: 'WOOD_FLOOR',
    name: 'Wood',
    texture: 'floors/wood.png',

    isIndoor: true,
});

export const TILE = new FoundationMaterial({
    id: 'TILE_FLOOR',
    name: 'Tile',
    texture: 'floors/tile.png',

    isIndoor: true,
})

export const BRICK_FLOOR = new FoundationMaterial({
    id: 'BRICK_FLOOR',
    name: 'Brick',
    texture: 'floors/brick.png',

    isIndoor: true,
})

export const CONCRETE_FLOOR = new FoundationMaterial({
    id: 'CONCRETE_FLOOR',
    name: 'Concrete',
    texture: 'floors/concrete.png',

    isIndoor: true,
});

export const CARPET = new FoundationMaterial({
    id: 'CARPET',
    name: 'Carpet',
    texture: 'floors/carpet.png',

    isIndoor: true,
});


export const TOILET = new ObjectMaterial({
    id: 'TOILET',
    name: 'Toilet',

    width: 1,
    height: 1,
    type: Toilet,
    texture: 'objects/toilet.png'
});

export const DESK = new ObjectMaterial({
    id: 'DESK',
    name: 'Desk',

    width: 1,
    height: 2,
    type: Desk,
    texture: 'objects/desk.png'
});

export const WOOD_TABLE = new ObjectMaterial({
    id: 'WOOD_TABLE',
    name: 'Wood table',

    width: 1,
    height: 2,
    type: WoodTable,
    texture: 'objects/woodTable.png',
});

export const BULLDOZER = new ObjectMaterial({
    id: 'BULLDOZER',
    name: 'Remove objects',

    width: 1,
    height: 1,
    type: Toilet,
    texture: texture.transparent,
    thumbnail: 'demolish.png',
});