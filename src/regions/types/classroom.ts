import * as materials from 'world/materials';
import * as requirements from '../requirements';

import Vector from 'math/vector';
import Region from '../region';

import Student from 'world/entities/student';
import Teacher from 'world/entities/teacher';

class Classroom extends Region {
    public readonly students = new Array<Student>();
    public teacher: Teacher;
    
    constructor(def: Region.Definition) {
        super(def);

    }
}

export default Classroom;