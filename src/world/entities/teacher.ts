import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as objects from 'world/objects';

import * as regions from 'regions';

import Vector from 'math/vector';

import Lockers from 'world/objects/lockers';
import Classroom from 'regions/types/classroom';

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

class TeacherAI extends AI<WalkingEntity, State> {
    private _room: Classroom;
    private _timeout: number;

    constructor(entity: Teacher) {
        super(entity, State.Idle);

        this.entity.salary = 170;

        world.on('change', this._update, this);
        this.onState(State.Idle, this._update, this);
        this.entity.on('removed', this._cleanup, this);

        world.on('change', this._wander, this);
        this.entity.on('idle', this._wander, this);
    }

    private _walk() {
        clearTimeout(this._timeout);

        let options = this._room.tiles.filter(t => world.isPassable(t));

        let rand = Math.floor(Math.random() * options.length);
        let tile = options[rand];

        this.entity.walkTo(tile);
    }

    private _wander() {
        clearTimeout(this._timeout);

        this._timeout = setTimeout(() => {
            if (!this._room)
                return;

            this._walk();
        }, 3000 + Math.random() * 7000);
    }

    private _cleanup() {
        world.off('change', this._update, this);
        world.off('change', this._wander, this);

        if (this._room) {
            this._room.removeTeacher();
        }
    }

    private _update() {
        if (this._room && (regions.allRegions.indexOf(this._room) < 0)) {
            let r = this._room;
            this._room = null;
            r.removeTeacher();
        }

        if (!this._room)
            this._getRoom();
    }

    private _getRoom() {
        let possible = regions.allRegions.filter(o => o instanceof Classroom && !o.hasTeacher);

        if (possible.length == 0)
            return;

        this._room = possible[0] as Classroom;
        this._room.setTeacher(this.entity);

        this._walk();
    }
}

class Teacher extends WalkingEntity {
    constructor(position: Vector) {
        super(position);

        new TeacherAI(this);

        let male = rand(2) == 1;

        let headIndex = rand(3);
        let hairIndex = rand(4);
        let lipsIndex = male ? 1 : 0;
        let eyesIndex = rand(3);

        let bodySize = male ? 1 : 0;
        let bodyIndex = rand(3);

        let t = 33;

        debugger;
        let rects = [
            new pixi.Rectangle(bodyIndex * t, (8 + bodySize) * t, t, t),
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

export default Teacher;