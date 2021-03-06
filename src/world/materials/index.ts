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

import Sink from 'world/objects/sink';

import Bookshelf from 'world/objects/bookshelf';
import Chair from 'world/objects/chair';
import ComputerTable from 'world/objects/computerTable';
import Lockers from 'world/objects/lockers';
import LunchTable from 'world/objects/lunchTable';

import Field from 'world/objects/field';

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

    cost: 50,
});

export const BRICK_WALL = new WallMaterial({
    id: 'BRICK_WALL',
    name: 'Brick',
    texture: 'walls/brick.png',

    isSolid: true,
    indoor: true,
    outdoor: true,

    cost: 60,
});

export const AIR = new PlainBlockMaterial({
    id: 'AIR',
    name: 'Remove walls',
    texture: texture.transparent,
    thumbnail: 'demolish.png',

    isSolid: false,

    cost: 0
});


export const GRASS = new GrassMaterial();

export const DIRT = new FoundationMaterial({
    id: 'DIRT',
    name: 'Dirt',
    texture: 'floors/dirt.png',
    
    cost: 0,
});

export const WOOD_FLOOR = new FoundationMaterial({
    id: 'WOOD_FLOOR',
    name: 'Wood',
    texture: 'floors/wood.png',

    isIndoor: true,

    cost: 50
});

export const TILE = new FoundationMaterial({
    id: 'TILE_FLOOR',
    name: 'Tile',
    texture: 'floors/tile.png',

    isIndoor: true,

    cost: 30,
})

export const BRICK_FLOOR = new FoundationMaterial({
    id: 'BRICK_FLOOR',
    name: 'Brick',
    texture: 'floors/brick.png',

    isIndoor: true,

    cost: 20,
})

export const CONCRETE_FLOOR = new FoundationMaterial({
    id: 'CONCRETE_FLOOR',
    name: 'Concrete',
    texture: 'floors/concrete.png',

    isIndoor: true,

    cost: 10
});

export const CARPET = new FoundationMaterial({
    id: 'CARPET',
    name: 'Carpet',
    texture: 'floors/carpet.png',

    isIndoor: true,

    cost: 30
});


export const TOILET = new ObjectMaterial({
    id: 'TOILET',
    name: 'Toilet',

    width: 1,
    height: 1,
    type: Toilet,
    texture: 'objects/toilet.png',

    cost: 100
});

export const DESK = new ObjectMaterial({
    id: 'DESK',
    name: 'Desk',

    width: 1,
    height: 1,
    type: Desk,
    texture: 'objects/desk.png',
    
    cost: 80
});

export const WOOD_TABLE = new ObjectMaterial({
    id: 'WOOD_TABLE',
    name: 'Wood table',

    width: 1,
    height: 2,
    type: WoodTable,
    texture: 'objects/woodTable.png',

    cost: 100
});

export const BOOKSHELF = new ObjectMaterial({
    id: 'BOOKSHELF',
    name: 'Bookshelf',

    width: 1,
    height: 1,
    type: Bookshelf,
    texture: 'objects/bookshelf.png',

    cost: 200
});

export const CHAIR = new ObjectMaterial({
    id: 'CHAIR',
    name: 'Chair',

    width: 1,
    height: 1,
    type: Chair,
    texture: 'objects/chair.png',

    cost: 50
});

export const COMPUTER_TABLE = new ObjectMaterial({
    id: 'COMPUTER_TABLE',
    name: 'Computer table',

    width: 2,
    height: 1,
    type: ComputerTable,
    texture: 'objects/computerTable.png',

    cost: 800
});

export const LUNCH_TABLE = new ObjectMaterial({
    id: 'LUNCH_TABLE',
    name: 'Lunch table',

    width: 1,
    height: 3,
    type: LunchTable,
    texture: 'objects/lunchTable.png',

    cost: 500
});

export const LOCKERS = new ObjectMaterial({
    id: 'LOCKERS',
    name: 'Lockers',

    width: 1,
    height: 1,
    type: Lockers,
    texture: 'objects/locker.png',

    cost: 200
});

export const SINK = new ObjectMaterial({
    id: 'SINK',
    name: 'Sink',

    width: 1,
    height: 1,
    type: Sink,
    texture: 'objects/sink.png',

    cost: 100
});

export const FIELD = new ObjectMaterial({
    id: 'FIELD',
    name: 'Game field',

    width: 10,
    height: 20,
    type: Field,
    texture: 'objects/field.png',

    cost: 10000
});


export const BULLDOZER = new ObjectMaterial({
    id: 'BULLDOZER',
    name: 'Remove objects',

    width: 1,
    height: 1,
    type: Toilet,
    texture: texture.transparent,
    thumbnail: 'demolish.png',

    cost: 0
});