import * as pixi from 'pixi.js';

import * as world from 'world';
import * as blocks from 'world/blocks';

import * as jobs from 'construction/job'
import * as construction from 'construction';

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
    private _job: jobs.Base;
    private _failed = new Set<jobs.Base>();
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

    private _setJob(job: jobs.Base) {
        if (this._job != null) {
            this._job.off('state', this.pulse);
            if (this._job.state == jobs.State.ASSIGNED)
                this._job.state = jobs.State.WAITING;
        }
        
        this._job = job;

        if (job !== null) {
            this.state = State.Walking;

            job.state = jobs.State.ASSIGNED;
            job.on('state', this.pulse, this);
        } else {
            this.state = State.Idle;
        }
    }

    private _wander() {
        let sleep = 2500 + Math.random() * 10000;
        clearTimeout(this._wanderTimeout);

        this._wanderTimeout = setTimeout(this.if(State.Idle, () => {
            let x = Math.random() * 6 - 3;
            let y = Math.random() * 6 - 3;

            let pos = this.entity.position.add(x, y);

            if (!world.isPassable(pos.apply(Math.floor)))
                return this._wander();

            this.entity.walkTo(pos);
        }), sleep);
    }

    private _onIdle() {
        let distance = Number.MAX_SAFE_INTEGER;

        let closest: jobs.Base;
        for (let job of construction.active) {
            if (this._failed.has(job))
                continue;

            if (job.state != jobs.State.WAITING)
                continue;

            let diff = job.position.add(this.entity.position.scale(-1));
            if (diff.length < distance) {
                closest = job;
                distance = diff.length;
            }
        }

        if (this._job && closest == this._job)
            return;

        if (closest) {
            this._setJob(closest);
        } else {
            this._wander();
        }
    }

    private _onWalking() {
        if (this._job.state == jobs.State.CANCELLED) {
            this._setJob(null);
            this.entity.stop();
            return;
        }

        let target = this._job.position.apply(a => a + 0.5);
        let diff = target.add(this.entity.position.scale(-1));

        if (diff.length < 0.5) {
            this.state = State.Working;
        } else {
            let success = this.entity.walkTo(this._job.position);
            if (!success) {
                this._failed.add(this._job);
                // Failed to path to job :(
                this._setJob(null);
            }
        }
    }

    private _work(dT: number) {
        if (this._job.state == jobs.State.CANCELLED) {
            this._setJob(null);
            return;
        }

        this._job.progress += dT;

        if (this._job.progress >= 1) {
            construction.finish(this._job);
            this._setJob(null);
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