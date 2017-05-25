import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as materials from 'world/materials';

import Vector from 'math/vector';
import GameObject from './object';

class Bookshelf extends GameObject {
    constructor(pos: Vector, dir: Vector) {
        super(materials.BOOKSHELF, pos, dir);
    }
}

export default Bookshelf;