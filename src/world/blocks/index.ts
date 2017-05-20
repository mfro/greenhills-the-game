import * as pixi from 'pixi.js';
import * as camera from 'camera';
import * as lifecycle from 'lifecycle';

import * as world from 'world';

import Vector from 'math/vector';

import Material from './material';
import Tile from './tile';


let tiles = new Array<Array<Tile>>();
let container = new pixi.Container();

export { Material, Tile };

export function setTile(x: number, y: number, material: Material) {
    if (x < 0 || x >= world.size.x || y < 0 || y >= world.size.y)
        throw new Error('Invalid coordinates: ' + x + ',' + y);

    if (tiles[x][y]) {
        if (tiles[x][y].material == material) return;

        container.removeChild(tiles[x][y].sprite);
    }

    if (material == null) {
        tiles[x][y] = null;
    } else {
        tiles[x][y] = new Tile(material, new Vector(x, y));

        container.addChildAt(tiles[x][y].sprite, 0);
    }

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

lifecycle.hook('init', 'create-world', app => {
    for (let x = 0; x < world.size.x; x++) {
        tiles[x] = new Array<Tile>();

        for (let y = 0; y < world.size.y; y++) {
            tiles[x][y] = null;
        }
    }

    camera.addObject(container, 1);
});