import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as materials from 'world/materials';

import Vector from 'math/vector';
import GameObject from './object';

import Student from 'world/entities/student';

class Lockers extends GameObject {
    public owner: Student;
    
    constructor(pos: Vector, dir: Vector) {
        super(materials.LOCKERS, pos, dir);
    }
}

export default Lockers;