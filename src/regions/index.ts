import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';
import * as materials from 'world/materials';
import * as requirements from './requirements';

import Vector from 'math/vector';
import Region from './region';

import Library from './types/library';
import Bathroom from './types/bathroom';
import Cafeteria from './types/cafeteria';
import Classroom from './types/classroom';
import ComputerLab from './types/computerlab';

export {
    Region as Base,
    Classroom,
};

const container = new pixi.Container();

export const allRegions = new Array<Region>();

export function addRegion(region: Region) {
    allRegions.push(region);

    container.addChildAt(region.container, 0);
    world.emit('change', new Vector());
}

export function removeRegion(region: Region) {
    let index = allRegions.indexOf(region);
    if (index < 0) return;

    allRegions.splice(index, 1);

    container.removeChild(region.container);
    world.emit('change', new Vector());
}

export function getRegion(tile: Vector) {
    return allRegions.find(r => {
        return r.tiles.find(t => Vector.equals(t, tile)) != null;
    });
}

export const CLASSROOM = <Region.Definition>{
    id: 'CLASSROOM',
    name: 'Classroom',

    constructor: Classroom,

    requirements: [
        new requirements.Indoor(),
        new requirements.Object(materials.DESK, 10),
    ]
};

export const CAFETERIA = <Region.Definition>{
    id: 'CAFETERIA',
    name: 'Cafeteria',

    constructor: Cafeteria,

    requirements: [
        new requirements.Indoor(),
        new requirements.Object(materials.LUNCH_TABLE, 6),
    ]
};

export const BATHROOM = <Region.Definition>{
    id: 'BATHROOM',
    name: 'Bathroom',

    constructor: Bathroom,

    requirements: [
        new requirements.Indoor(),
        new requirements.Object(materials.SINK, 1),
        new requirements.Object(materials.TOILET, 1),
    ]
};

export const COMPUTER_LAB = <Region.Definition>{
    id: 'COMPUTER_LAB',
    name: 'Computer lab',

    constructor: ComputerLab,

    requirements: [
        new requirements.Indoor(),
        new requirements.Object(materials.SINK, 1),
        new requirements.Object(materials.COMPUTER_TABLE, 2),
    ]
};

export const LIBRARY = <Region.Definition>{
    id: 'LIBRARY',
    name: 'Library',

    constructor: Library,

    requirements: [
        new requirements.Indoor(),
        new requirements.Object(materials.BOOKSHELF, 2),
    ]
};

app.hook('init', 'regions', () => {
    camera.addObject(container, 1);
});