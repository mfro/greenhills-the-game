import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as materials from 'world/materials';

import Vector from 'math/vector';
import GameObject from './object';

class ComputerTable extends GameObject {
    constructor(pos: Vector, dir: Vector) {
        super(materials.COMPUTER_TABLE, pos, dir);
    }
}

export default ComputerTable;