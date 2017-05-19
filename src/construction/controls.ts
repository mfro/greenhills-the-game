import * as pixi from 'pixi.js';
import * as mouse from 'input/mouse';
import * as camera from 'camera';
import * as lifecycle from 'lifecycle';

import * as world from 'world';
import FloorMaterial from 'world/floor-material';

import Vector from 'math/vector';

let start: Vector;
let end: Vector;

let graphics = new pixi.Graphics();

export var x = 5;

camera.addObject(graphics, 1000);

mouse.on('down', e => {
    start = camera.transform(e.position);
    start = start.apply(Math.floor);

    if (start.x < 0 || start.y < 0 ||
        start.x >= world.size.x || start.y >= world.size.y)
        start = null;
});

mouse.on('up', e => {
    if (!start) return;

    let { min, max } = compute();

    start = null;
    graphics.clear();

    if (e.button == 0) {
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                world.setFloorTile(x, y, FloorMaterial.CONCRETE);
            }
        }
    } else if (e.button == 2) {
        for (let x = min.x; x <= max.x; x++) {
            for (let y = min.y; y <= max.y; y++) {
                world.setFloorTile(x, y, FloorMaterial.DIRT);
            }
        }
    }
});

function update() {
    if (!start) return;

    let { min, max } = compute();

    graphics.clear();
    graphics.beginFill(0xFF0000, 0.5);
    graphics.drawRect(min.x, min.y, max.x - min.x + 1, max.y - min.y + 1);
    graphics.endFill();
}

function compute() {
    end = camera.transform(mouse.position);
    end = end.apply(Math.floor);

    let min = new Vector(Math.min(start.x, end.x), Math.min(start.y, end.y));
    let max = new Vector(Math.max(start.x, end.x), Math.max(start.y, end.y));

    min = min.apply(v => Math.clamp(v, 0, world.size.x - 1));
    max = max.apply(v => Math.clamp(v, 0, world.size.x - 1));
    
    return { min, max };
}

lifecycle.hook('init', 'controls/building', app => {
    app.ticker.add(update);
});