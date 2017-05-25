import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as materials from 'world/materials';

import Vector from 'math/vector';
import GameObject from './object';

class LunchTable extends GameObject {
    constructor(pos: Vector, dir: Vector) {
        super(materials.LUNCH_TABLE, pos, dir);
    }
}

export default LunchTable;