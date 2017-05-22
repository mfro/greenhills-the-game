import * as pixi from 'pixi.js';

import * as world from 'world';
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

class BuilderAI extends AI<Builder, State> {
    private _job: Job;
    private _failed = new Set<Job>();

    constructor(entity: Builder) {
        super(entity, State.Idle);

        this.on('state', this.switch({
            [State.Idle]: this._onIdle,
            [State.Walking]: this._onWalking,
            [State.Working]: this._onWorking,
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

        this.entity.on('idle', this.if(State.Idle, this._wander));
        world.on('change', () => this._failed.clear());
    }

    private _wander() {
        console.log('wandering....');
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
            return true;
        }

        return false;
    }

    private _onWalking() {
        let target = this._job.position.apply(a => a + 0.5);
        let diff = target.add(this.entity.position.scale(-1));

        if (diff.length < 1) {
            this.state = State.Working;
        } else {
            let success = this.entity.walkTo(this._job.position);
            if (!success) {
                // Failed to path to job :(
                construction.addJob(this._job);
                this._job = null;
                this.state = State.Idle;
            }
        }
    }

    private _onWorking() {
        construction.finish(this._job);
        this._job = null;
        this.state = State.Idle;
    }
}

class Builder extends WalkingEntity {
    private _job: Job;
    private _state = State.Idle;

    constructor(position: Vector) {
        super(position);

        new BuilderAI(this);

        let graphics = new pixi.Graphics();

        graphics.beginFill(0xeeff35, 1);
        graphics.drawCircle(0, 0, 0.45);
        graphics.endFill();

        // construction.on('job', this._onJob, this);
        this.container.addChildAt(graphics, 0);
    }

    // public update(dT: number) {
    //     if (!this._job) {
    //         let distance = Number.MAX_SAFE_INTEGER;

    //         for (let job of construction.pending) {
    //             let diff = job.position.add(this.position.scale(-1));
    //             if (diff.length < distance) {
    //                 this._job = job;
    //                 distance = diff.length;
    //             }
    //         }

    //         if (this._job) {
    //             let index = construction.pending.indexOf(this._job);
    //             construction.pending.splice(index, 1);
    //         }
    //     }

    //     if (this._job) {
    //         if (this.target == null) {
    //             if (this._state == State.Idle) {
    //                 this.walkTo(this._job.position);
    //                 this._state = State.Walking;
    //             }

    //             else if (this._state == State.Walking) {
    //                 let cell = this.position.apply(Math.floor);

    //                 if (cell.equals(this._job.position)) {
    //                     this._state = State.Working;
    //                 } else {
    //                     // Failed to path to job :/
    //                     construction.addJob(this._job);
    //                     this._job = null;
    //                     this._state = State.Idle;
    //                 }
    //             }

    //             else if (this._state == State.Working) {
    //                 construction.finish(this._job);
    //                 this._job = null;
    //                 this._state = State.Idle;
    //             }
    //         }
    //     }

    //     super.update(dT);
    // }
}

export default Builder;