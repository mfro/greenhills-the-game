import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as materials from 'world/materials';
import * as requirements from './requirements';

import Vector from 'math/vector';
import Region from './region';

import Classroom from './types/classroom';

export {
    Region as Base,
    Classroom,
};

const regions = new Array<Region>();
const container = new pixi.Container();

export function addRegion(region: Region) {
    regions.push(region);

    container.addChildAt(region.container, 0);
}

export function removeRegion(region: Region) {
    let index = regions.indexOf(region);
    if (index < 0) return;

    regions.splice(index, 1);

    container.removeChild(region.container);
}

export function getRegion(tile: Vector) {
    return regions.find(r => {
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

app.hook('init', 'regions', () => {
    camera.addObject(container, 1);
});