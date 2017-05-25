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

class StudentAI extends AI<WalkingEntity, State> {
    private _locker: Lockers;
    private _room: Classroom;

    private _lastIncome = 0;

    constructor(entity: Student) {
        super(entity, State.Idle);

        world.on('change', this._update, this);
        this.onState(State.Idle, this._update, this);
        this.entity.on('removed', this._cleanup, this);
        this.entity.on('update', this._income, this);
    }

    private _cleanup() {
        if (this._locker) {
            this._locker.owner = null;
        }

        if (this._room) {
            let index = this._room.students.indexOf(this.entity);
            this._room.students.splice(index, 1);
            world.emit('change', this._room.tiles[0]);
        }
    }

    private _income() {
        if (!this._room || !this._locker)
            return;

        let now = performance.now();

        if (now - this._lastIncome > 3000) {
            this._lastIncome = now;
            world.setCash(world.cash + 10);
        }
    }

    private _update() {
        if (objects.allObjects.indexOf(this._locker) < 0)
            this._locker = null;

        if (regions.allRegions.indexOf(this._room) < 0 || !this._room.validate())
            this._room = null;

        if (!this._locker)
            this._getLocker();

        if (!this._room)
            this._getRoom();
    }

    private _getRoom() {
        let possible = regions.allRegions.filter(o => o instanceof Classroom && o.students.length < 10 && o.teacher && o.validate());

        if (possible.length == 0)
            return;

        this._room = possible[0] as Classroom;
        this._room.students.push(this.entity);
    }

    private _getLocker() {
        let possible = objects.allObjects.filter(o => o instanceof Lockers && !o.owner);

        if (possible.length == 0)
            return;

        this._locker = possible[0] as Lockers;
        this._locker.owner = this.entity;

        let target = this._locker.position.add(this._locker.direction);
        let path = this.entity.walkTo(target);

        if (!path) {
            this._locker.owner = null;
            this._locker = null;
            return;
        }
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