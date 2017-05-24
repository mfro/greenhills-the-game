import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as materials from 'world/materials';

import Vector from 'math/vector';
import GameObject from './object';

class Toilet extends GameObject {
    constructor(pos: Vector, dir: Vector) {
        super(materials.TOILET, pos, dir);
    }
}

export default Toilet;