import * as pixi from 'pixi.js';

import * as blocks from './blocks'
import * as objects from './objects';
import * as foundations from './foundations';

import * as entities from './entities';

import { EventEmitter } from 'eventemitter3';

import Vector from 'math/vector';

export const size = new Vector(100, 100);

export let cash = 50000;

const events = new EventEmitter<{
    change: Vector;
}>();

export const on = events.on;
export const once = events.once;

export function isPassable(tile: Vector) {
    let block = blocks.getTile(tile);
    if (block.material.isSolid)
        return false;

    let obj = objects.getObject(tile);
    if (obj != null)
        return false;

    return true;
}

blocks.on('change', update);
foundations.on('change', update);

function update(pos: Vector) {
    for (let x = Math.max(0, pos.x - 1); x < Math.min(size.x, pos.x + 2); x++) {
        for (let y = Math.max(0, pos.y - 1); y < Math.min(size.y, pos.y + 2); y++) {
            let v = new Vector(x, y);

            blocks.update(v);
            foundations.update(v);

            entities.update(v);
        }
    }

    events.emit('change', pos);
}