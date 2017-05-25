import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as world from 'world';
import * as blocks from 'world/blocks';

import * as jobs from 'construction/job'
import * as construction from 'construction';

import Vector from 'math/vector';

import AI from './ai';
import Entity from './entity';
import WalkingEntity from './walkingentity';

let atlas: pixi.Texture;
texture.load('people.png', t => atlas = t);

function rand(i: number) {
    return Math.floor(Math.random() * i);
}

enum State {
    Idle,
}

class StudentAI extends AI<WalkingEntity, State> {
    constructor(entity: Student) {
        super(entity, State.Idle);
    }
}

class Student extends WalkingEntity {
    constructor(position: Vector) {
        super(position);

        new StudentAI(this);

        let headIndex = rand(3);
        let hairIndex = rand(4);
        let lipsIndex = rand(2);
        let eyesIndex = rand(3);

        let bodySize = rand(3);
        let bodyIndex = rand(6);

        let t = 33;

        let rects = [
            new pixi.Rectangle(bodyIndex * t, (4 + bodySize) * t, t, t),
            new pixi.Rectangle(headIndex * t, 0 * t, t, t),
            new pixi.Rectangle(lipsIndex * t, 3 * t, t, t),
            new pixi.Rectangle(eyesIndex * t, 2 * t, t, t),
            new pixi.Rectangle(hairIndex * t, 1 * t, t, t),
        ];

        for (let rect of rects) {
            let tex = new pixi.Texture(atlas.baseTexture, rect);
            let sprite = new pixi.Sprite(tex);

            sprite.width = 1;
            sprite.height = 1;
            sprite.position.set(-0.5);

            this.container.addChildAt(sprite, 0);
        }
    }
}

export default Student;