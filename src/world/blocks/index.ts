import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';
import * as materials from 'world/materials';

import Vector from 'math/vector';
import Array2D from 'math/array2d';
import { EventEmitter } from 'eventemitter3';

import Tile from './tile';

const events = new EventEmitter<{
    change: Vector;
}>();

let tiles: Array2D<Tile>;
const container = new pixi.Container();

export const on = events.on;
export const once = events.once;

export { Tile };

export function setTile(x: number, y: number, material: materials.Block) {
    if (x < 0 || x >= world.size.x || y < 0 || y >= world.size.y)
        throw new Error('Invalid coordinates: ' + x + ',' + y);

    if (tiles.get(x, y)) {
        if (tiles.get(x, y).material == material) return;

        container.removeChild(tiles.get(x, y).sprite);
    }

    if (material == null) {
        tiles.set(x, y, null);
    } else {
        let tile = new Tile(material, new Vector(x, y));
        tiles.set(x, y, tile);

        container.addChildAt(tile.sprite, 0);
    }

    events.emit('change', new Vector(x, y));
}

export function getTile(point: Vector): Tile
export function getTile(x: number, y: number): Tile
export function getTile(a: Vector | number, b?: number): Tile {
    return tiles.get(a as any, b as any);
}

export function update(pos: Vector) {
    let tile = tiles.get(pos);

    if (!tile) return;

    tile.update();
}

app.hook('init', 'blocks', () => {
    tiles = new Array2D<Tile>(world.size.x, world.size.y);

    for (let x = 0; x < world.size.x; x++) {
        for (let y = 0; y < world.size.y; y++) {
            let tile = new Tile(materials.AIR, new Vector(x, y));

            tiles.set(x, y, tile);

            container.addChildAt(tile.sprite, 0);
        }
    }

    camera.addObject(container, 1);
});