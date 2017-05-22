import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';

import Vector from 'math/vector';
import Array2D from 'math/array2d';
import { EventEmitter } from 'eventemitter3';

import Material from './material';
import Tile from './tile';

const events = new EventEmitter<{
    change: Vector;
}>();

let tiles: Array2D<Tile>;
const container = new pixi.Container();

export const on = events.on;
export const once = events.once;

export { Material, Tile };

export function setTile(x: number, y: number, material: Material) {
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

export function getTile(x: number, y: number) {
    return tiles.get(x, y);
}

export function update(pos: Vector) {
    let tile = tiles.get(pos);

    if (!tile) return;

    tile.update();
}


app.hook('init', 'blocks', () => {
    tiles = new Array2D<Tile>(world.size.x, world.size.y);
    
    camera.addObject(container, 1);
});