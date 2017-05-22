import * as pixi from 'pixi.js';

import Vector from 'math/vector';

import * as blocks from './blocks'
import * as foundations from './foundations';

import * as entities from './entities';

export const size = new Vector(100, 100);

export function update(pos: Vector) {
    for (let x = Math.max(0, pos.x - 1); x < Math.min(size.x, pos.x + 2); x++) {
        for (let y = Math.max(0, pos.y - 1); y < Math.min(size.y, pos.y + 2); y++) {

            let v = new Vector(x, y);
            blocks.update(v);
            foundations.update(v);

            entities.update(v);
        }
    }
}