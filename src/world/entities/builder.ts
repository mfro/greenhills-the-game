import * as pixi from 'pixi.js';

import * as construction from 'construction';

import Job from 'construction/job'
import Vector from 'math/vector';

import WalkingEntity from './walkingentity';

enum State {
    Idle,
    Walking,
    Working,
}

class Builder extends WalkingEntity {
    private _job: Job;
    private _state = State.Idle;

    constructor(position: Vector) {
        super(position);

        let graphics = new pixi.Graphics();

        graphics.beginFill(0xeeff35, 1);
        graphics.drawCircle(0, 0, 0.45);
        graphics.endFill();

        this.container.addChildAt(graphics, 0);
    }

    public update(dT: number) {
        if (!this._job) {
            let distance = Number.MAX_SAFE_INTEGER;

            for (let job of construction.pending) {
                let diff = job.position.add(this.position.scale(-1));
                if (diff.length < distance) {
                    this._job = job;
                    distance = diff.length;
                }
            }

            if (this._job) {
                let index = construction.pending.indexOf(this._job);
                construction.pending.splice(index, 1);
            }
        }

        if (this._job) {
            if (this.target == null) {
                if (this._state == State.Idle) {
                    this.walkTo(this._job.position);
                    this._state = State.Walking;
                }

                else if (this._state == State.Walking) {
                    let cell = this.position.apply(Math.floor);

                    if (cell.equals(this._job.position)) {
                        this._state = State.Working;
                    } else {
                        // Failed to path to job :/
                        construction.addJob(this._job);
                        this._job = null;
                        this._state = State.Idle;
                    }
                }

                else if (this._state == State.Working) {
                    construction.finish(this._job);
                    this._job = null;
                    this._state = State.Idle;
                }
            }
        }

        super.update(dT);
    }
}

export default Builder;