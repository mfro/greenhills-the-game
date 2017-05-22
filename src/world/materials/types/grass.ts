import * as pixi from 'pixi.js';

import * as texture from 'texture';
import * as materials from 'world/materials';

import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import Material from '../material';
import FoundationMaterial from '../foundation';

class GrassMaterial extends FoundationMaterial {
    constructor() {
        super({
            id: 'GRASS',
            texture: 'floors/grass.png',
        });
    }

    public update(tile: foundations.Tile) {
        let block = blocks.getTile(tile.position);

        if (block.material.isSolid)
            tile.material = materials.DIRT;
    }

    public isPlaceable(pos: Vector) {
        if (!super.isPlaceable(pos))
            return false;

        let block = blocks.getTile(pos);
        return !block.material.isSolid;
    }
}

export default GrassMaterial;