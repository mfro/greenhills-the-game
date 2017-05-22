import * as pixi from 'pixi.js';

import * as world from 'world';
import * as pathing from './pathing';

import Vector from 'math/vector';
import Entity from './entity';

const speed = 5;

class WalkingEntity extends Entity {
    private _next: Vector;
    private _queue: Array<Vector>;

    private _target: Vector;
    public get target() { return this._target; }

    constructor(position: Vector) {
        super(position);

        world.on('change', () => {
            if (this.target) {
                this.walkTo(this.target);
            }
        });
    }

    public walkTo(position: Vector) {
        let path = pathing.astar(this.position, position);
        if (!path) return false;

        this._target = position;

        pathing.smooth(path, 0.45);

        this._next = null;

        if (path.length > 1)
            path.shift();

        this._queue = path.map(v => {
            return v.apply(Math.floor).apply(i => i + 0.5);
        });

        return true;
    }

    public update(dT: number) {
        let distance = speed * dT;

        while (this._queue && distance > 0.0001) {
            if (!this._next)
                this._next = this._queue.shift();

            if (!this._next) {
                this._queue = null;
                this._target = null;
                this.emit('idle');
            } else {
                let delta = this._next.add(this.position.scale(-1));

                if (delta.length > distance) {
                    delta = delta.scale(distance / delta.length);
                    this.position = this.position.add(delta);
                } else {
                    this.position = this._next;
                    this._next = null;
                }

                distance -= delta.length;
            }
        }

        super.update(dT);
    }
}

export default WalkingEntity;