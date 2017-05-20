import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';
import * as blocks from 'world/blocks';

import Vector from 'math/vector';

import Material from './material';
import Tile from './tile';


let tiles = new Array<Array<Tile>>();
let container = new pixi.Container();

export { Material, Tile };

export function setTile(x: number, y: number, material: Material) {
    if (tiles[x][y].material == material)
        return;

    tiles[x][y].material = material;

    world.update(new Vector(x, y));
}

export function getTile(x: number, y: number) {
    if (x < 0 || x >= world.size.x || y < 0 || y >= world.size.y)
        return null;

    return tiles[x][y];
}

export function update(pos: Vector) {
    if (!tiles[pos.x][pos.y]) return;

    tiles[pos.x][pos.y].update();
}

app.hook('init', 'create-world', () => {
    for (let x = 0; x < world.size.x; x++) {
        tiles[x] = new Array<Tile>();

        for (let y = 0; y < world.size.y; y++) {
            tiles[x][y] = new Tile(Material.GRASS, new Vector(x, y));
            container.addChildAt(tiles[x][y].sprite, 0);
        }
    }

    camera.addObject(container, 0);
});