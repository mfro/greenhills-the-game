import * as pixi from 'pixi.js';
import * as texture from 'texture';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as objects from 'world/objects';

import * as regions from 'regions';

import Vector from 'math/vector';

import Desk from 'world/objects/desk';
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
    WalkingToLocker,
    WalkingToDesk,
    AtLocker,
    AtDesk,
}

class StudentAI extends AI<Student, State> {
    private _locker: Lockers;
    private _room: Classroom;
    private _desk: Desk;

    private _timeout: number;

    constructor(entity: Student) {
        super(entity, State.Idle);

        world.on('change', this._update, this);
        this.on('state', this._update, this);
        this.entity.on('removed', this._cleanup, this);

        world.on('change', this.pulse, this);

        this.onState(State.AtDesk, this._onAtDesk, this);
        this.onState(State.AtLocker, this._onAtLocker, this);

        this.entity.on('idle', this.switch({
            [State.WalkingToDesk]: () => {
                this.state = State.AtDesk;
            },

            [State.WalkingToLocker]: () => {
                this.state = State.AtLocker;
            }
        }))
    }

    private _onAtDesk() {
        if (!this._locker)
            return;

        clearTimeout(this._timeout);
        this._timeout = setTimeout(this.if(State.AtDesk, () => {
            this._walkToLocker();
        }), 5000 + Math.random() * 5000);
    }

    private _onAtLocker() {
        if (!this._room || !this._desk)
            return;

        clearTimeout(this._timeout);
        this._timeout = setTimeout(this.if(State.AtLocker, () => {
            this._walkToDesk();
        }), 5000 + Math.random() * 5000);
    }

    private _walkToLocker() {
        if (!this._locker) {
            this.state = State.Idle;
            return
        }

        let dir = this._locker.direction;
        if (dir == Vector.up)
            dir = Vector.left;

        else if (dir == Vector.down)
            dir = Vector.right;

        else if (dir == Vector.left)
            dir = Vector.up;

        else if (dir == Vector.right)
            dir = Vector.down;

        let target = this._locker.position.add(dir);
        if (!world.isPassable(target)) {
            this._locker.owner = null;
            this._locker = null;
            return;
        }

        if (!this.entity.walkTo(target)) {
            this._locker.owner = null;
            this._locker = null;
            return;
        }

        this.state = State.WalkingToLocker;
    }

    private _walkToDesk() {
        if (!this._room || !this._desk) {
            this.state = State.Idle;
            return;
        }

        let target = this._desk.position;

        if (!this.entity.walkTo(target)) {
            return;
        }

        this.state = State.WalkingToDesk;
    }

    private _cleanup() {
        if (this._locker) {
            this._locker.owner = null;
            this._locker = null;
            world.change();
        }

        if (this._room) {
            this._room.removeStudent(this.entity);
            this._room = null;
        }
    }

    private _update() {
        if (this._locker && (objects.allObjects.indexOf(this._locker) < 0)) {
            this._locker.owner = null;
            this._locker = null;
        }

        if (this._room && (regions.allRegions.indexOf(this._room) < 0 || !this._room.hasTeacher || !this._room.isValid)) {
            this._room.removeStudent(this.entity);
            this._room = null;
        }

        if (!this._locker)
            this._getLocker();

        if (!this._room)
            this._getRoom();

        this.entity.happy = (this._locker != null && this._room != null);

        if (this.entity.happy)
            this.entity.salary = -35;
        else
            this.entity.salary = 0;

        if (this.state == State.Idle) {
            if (this._locker) {
                this._walkToLocker();
            } else if (this._room) {
                this._walkToDesk();
            }
        }
    }

    private _getRoom() {
        let possible = regions.allRegions.filter(o => o instanceof Classroom && o.hasRoom && o.isValid);

        if (possible.length == 0)
            return;

        this._room = possible[0] as Classroom;
        this._desk = this._room.addStudent(this.entity);
    }

    private _getLocker() {
        let possible = objects.allObjects.filter(o => o instanceof Lockers && !o.owner);

        if (possible.length == 0)
            return;

        this._locker = possible[0] as Lockers;
        this._locker.owner = this.entity;

        this._walkToLocker();
    }
}

class Student extends WalkingEntity {
    public happy: boolean;

    private g = new pixi.Graphics();

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

        // this.g.position.set(-0.5, -0.5);
        // this.container.addChildAt(this.g, 1);
    }

    // public update(dT: number) {
    //     super.update(dT);

    //     this.g.clear();
    //     this.g.beginFill(this.happy ? 0x00FF00 : 0xFF0000, 0.1);
    //     this.g.drawRect(0, 0, 1, 1);
    //     this.g.endFill();
    // }
}

export default Student;