import * as pixi from 'pixi.js';

import * as pathing from './pathing';

import Vector from 'math/vector';
import Entity from './entity';

const speed = 8;

class WalkingEntity extends Entity {
    private _queue: Array<Vector>;
    private _target: Vector;

    public get target() { return this._target; }

    public walkTo(position: Vector) {
        let path = pathing.astar(this.position, position);
        if (!path) return false;

        pathing.smooth(path, 0.45);
        
        this._target = null;
        this._queue = path.map(v => {
            return v.apply(Math.floor).apply(i => i + 0.5);
        });

        return true;
    }

    public update(dT: number) {
        let distance = speed * dT;

        while (this._queue && distance > 0.0001) {
            if (!this._target)
                this._target = this._queue.shift();

            if (!this._target) {
                this._queue = null;
                this.emit('idle');
            } else {
                let delta = this._target.add(this.position.scale(-1));

                if (delta.length > distance) {
                    delta = delta.scale(distance / delta.length);
                    this.position = this.position.add(delta);
                } else {
                    this.position = this._target;
                    this._target = null;
                }

                distance -= delta.length;
            }
        }

        super.update(dT);
    }
}

export default WalkingEntity;