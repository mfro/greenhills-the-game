import Vector from 'math/vector';
import Material from 'world/material';

class Job {
    public readonly type: Job.Type;
    public readonly material: Material;

    public readonly position: Vector;

    public isAssigned: boolean;

    constructor(type: Job.Type, material: Material, position: Vector) {
        this.type = type;
        this.material = material;
        this.position = position;
    }
}

namespace Job {
    export enum Type {
        Block,
        Foundation,
    }
}

export default Job;