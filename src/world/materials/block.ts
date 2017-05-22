import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as blocks from 'world/blocks';

import Vector from 'math/vector';
import Material from './material';

abstract class BlockMaterial extends Material {
    public readonly isSolid: boolean;
    
    constructor(def: BlockMaterial.Definition) {
        super(def);

        this.isSolid = def.isSolid;
    }
}

namespace BlockMaterial {
    export interface Definition extends Material.Definition {
        isSolid: boolean;
    }
}

export default BlockMaterial;