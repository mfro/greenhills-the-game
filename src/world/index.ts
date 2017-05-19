import * as pixi from 'pixi.js';
import * as camera from 'camera';
import * as lifecycle from 'lifecycle';

import * as input from 'input/world';

import Vector from 'math/vector';

import FloorMaterial from './floor-material';
import FloorTile from './floor-tile';

let floorTiles = new Array<Array<FloorTile>>();
let floorContainer = new pixi.Container();

let hover = new pixi.Graphics();

export const size = new Vector(100, 100);

export function setFloorTile(x: number, y: number, material: FloorMaterial) {
    if (floorTiles[x][y]) {
        if (floorTiles[x][y].material == material) return;
        
        floorContainer.removeChild(floorTiles[x][y].sprite);
    }

    floorTiles[x][y] = new FloorTile(material, new Vector(x, y));

    floorContainer.addChildAt(floorTiles[x][y].sprite, 0);
}

lifecycle.hook('init', 'create-world', app => {
    for (let x = 0; x < size.x; x++) {
        floorTiles[x] = new Array<FloorTile>();

        for (let y = 0; y < size.y; y++) {
            setFloorTile(x, y, FloorMaterial.GRASS);
        }
    }

    camera.addObject(floorContainer, 0);
    camera.addObject(hover, 100);

    hover.beginFill(0xFF0000, 0.2);
    hover.drawRect(0, 0, 1, 1);
    hover.endFill();

    app.renderer.on('prerender', () => {
        let pos = input.getMousePosition().apply(Math.floor);

        hover.position = pos.toPoint();
    });
});