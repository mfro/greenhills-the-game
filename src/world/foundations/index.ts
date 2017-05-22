import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';
import * as blocks from 'world/blocks';

import Vector from 'math/vector';
import Array2D from 'math/array2d';

import Material from './material';
import Tile from './tile';


let tiles: Array2D<Tile>;
let container = new pixi.Container();

export { Material, Tile };

export function setTile(x: number, y: number, material: Material) {
    let tile = tiles.get(x, y);

    if (tile.material == material)
        return;

    tiles.get(x, y).material = material;

    world.update(new Vector(x, y));
}

export function getTile(x: number, y: number) {
    return tiles.get(x, y);
}

export function update(pos: Vector) {
    let tile = tiles.get(pos);
    if (!tile) return;

    tile.update();
}

app.hook('init', 'foundations', () => {
    tiles = new Array2D<Tile>(world.size.x, world.size.y);

    for (let x = 0; x < world.size.x; x++) {
        for (let y = 0; y < world.size.y; y++) {
            let tile = new Tile(Material.GRASS, new Vector(x, y));

            tiles.set(x, y, tile);

            container.addChildAt(tile.sprite, 0);
        }
    }

    camera.addObject(container, 0);
});