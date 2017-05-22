import * as pixi from 'pixi.js';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as construction from 'construction';

import Job from 'construction/job'
import Vector from 'math/vector';

import AI from './ai';
import Entity from './entity';
import WalkingEntity from './walkingentity';

enum State {
    Idle,
    Walking,
    Working,
}

class BuilderAI extends AI<WalkingEntity, State> {
    private _job: Job;
    private _failed = new Set<Job>();
    private _wanderTimeout: number;

    constructor(entity: Builder) {
        super(entity, State.Idle);

        this.on('state', this.switch({
            [State.Idle]: this._onIdle,
            [State.Walking]: this._onWalking,
        }));

        this.listen({
            [State.Idle]: {
                'change': world,
                'job': construction
            },

            [State.Walking]: {
                'idle': this.entity
            }
        });

        world.on('change', () => this._failed.clear());

        this.entity.on('idle', this.if(State.Idle, this._wander));
        this.entity.on('update', this.if(State.Working, this._work));
    }

    private _wander() {
        let sleep = 2500 + Math.random() * 10000;
        clearTimeout(this._wanderTimeout);

        this._wanderTimeout = setTimeout(this.if(State.Idle, () => {
            let x = Math.random() * 7 - 3;
            let y = Math.random() * 7 - 3;

            let pos = this.entity.position.add(x, y);

            let block = blocks.getTile(Math.floor(pos.x), Math.floor(pos.y));
            if (block.material.isSolid)
                return this._wander();

            this.entity.walkTo(pos);
        }), sleep);
    }

    private _onIdle() {
        let distance = Number.MAX_SAFE_INTEGER;

        for (let job of construction.pending) {
            if (this._failed.has(job))
                continue;

            let diff = job.position.add(this.entity.position.scale(-1));
            if (diff.length < distance) {
                this._job = job;
                distance = diff.length;
            }
        }

        if (this._job) {
            let index = construction.pending.indexOf(this._job);
            construction.pending.splice(index, 1);

            this.state = State.Walking;
        } else {
            this._wander();
        }
    }

    private _onWalking() {
        let target = this._job.position.apply(a => a + 0.5);
        let diff = target.add(this.entity.position.scale(-1));

        if (diff.length < 0.5) {
            this.state = State.Working;
        } else {
            let success = this.entity.walkTo(this._job.position);
            if (!success) {
                this._failed.add(this._job);
                // Failed to path to job :(
                construction.addJob(this._job);
                this._job = null;
                this.state = State.Idle;
            }
        }
    }

    private _work(dT: number) {
        this._job.progress += dT;

        if (this._job.progress >= 1) {
            construction.finish(this._job);
            this._job = null;
            this.state = State.Idle;
        }
    }
}

class Builder extends WalkingEntity {
    constructor(position: Vector) {
        super(position);

        new BuilderAI(this);

        let graphics = new pixi.Graphics();

        graphics.beginFill(0xeeff35, 1);
        graphics.drawCircle(0, 0, 0.45);
        graphics.endFill();

        this.container.addChildAt(graphics, 0);
    }
}

export default Builder;