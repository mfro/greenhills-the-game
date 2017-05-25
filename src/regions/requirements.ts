import * as materials from 'world/materials';

import * as blocks from 'world/blocks';
import * as objects from 'world/objects';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import GameObject from 'world/objects/object';

export abstract class Base {
    abstract validate(tiles: Vector[]): boolean;
}

export { ObjectRequirement as Object }
class ObjectRequirement extends Base {
    public readonly object: materials.Object;
    public readonly count: number;

    constructor(object: materials.Object, count: number) {
        super();

        this.object = object;
        this.count = count;
    }

    validate(tiles: Vector[]) {
        let done = new Set<GameObject>();

        for (let v of tiles) {
            let obj = objects.getObject(v);

            if (obj == null || obj.material != this.object)
                continue;

            if (done.has(obj))
                continue;

            done.add(obj);
        }

        return done.size >= this.count;
    }
}

export { IndoorRequirement as Indoor }
class IndoorRequirement extends Base {
    validate(tiles: Vector[]) {
        for (let v of tiles) {
            if (blocks.getTile(v).material.isSolid)
                return false;

            if (!foundations.getTile(v).material.isIndoor)
                return false;
        }

        return true;
    }
}