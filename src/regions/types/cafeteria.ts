import * as materials from 'world/materials';
import * as requirements from '../requirements';

import Vector from 'math/vector';
import Region from '../region';

class Cafeteria extends Region {
    constructor(def: Region.Definition) {
        super(def);
    }
}

export default Cafeteria;