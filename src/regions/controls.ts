import * as pixi from 'pixi.js';

import * as app from 'app';
import * as mouse from 'input/mouse';
import * as camera from 'camera';

import * as materials from 'world/materials';
import * as regions from 'regions';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';

let start: Vector;
let end: Vector;
let action: () => void;

let graphics = new pixi.Graphics();

export let type: regions.Base.Definition;

export function setType(t: regions.Base.Definition) {
    type = t;
}

mouse.on('down', 1000, e => {
    if (e.handled) return;
    if (type == null) return;

    if (start) {
        start = null;
        graphics.clear();
        return;
    }

    switch (e.button) {
        case 0:
            action = create;
            break;

        case 2:
            action = destroy;
            break;

        default: return;
    }

    start = camera.transform(e.position);
    start = start.apply(Math.floor);

    if (start.x < 0 || start.y < 0 ||
        start.x >= world.size.x || start.y >= world.size.y)
        start = null;

    e.handled = true;
});

mouse.on('up', 1000, e => {
    if (e.handled) return;

    if (!start) return;

    action();

    start = null;
    graphics.clear();

    e.handled = true;
});

app.hook('prerender', 'construction/controls', () => {
    if (!start) return;
    if (type == null) return;

    let { min, max } = compute();

    graphics.clear();
    graphics.beginFill(0xFF0000, 0.5);
    graphics.drawRect(min.x, min.y, max.x - min.x + 1, max.y - min.y + 1);
    graphics.endFill();
});

app.hook('init', 'construction/controls', () => {
    camera.addObject(graphics, 1000);
});

function create() {
    let { min, max } = compute();

    let tiles = new Array<Vector>();
    let region = new type.constructor(type);

    function merge(v: Vector, steal?: boolean) {
        let here = regions.getRegion(v);
        if (!here) return;;

        if (here instanceof type.constructor) {
            regions.removeRegion(here);
            tiles = tiles.concat(here.tiles);
        } else if (steal) {
            here = here as regions.Base;
            here.removeTile(v);
        }
    }

    for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
            tiles.push(new Vector(x, y));

            merge(new Vector(x, y), true);
        }

        if (min.y > 0)
            merge(new Vector(x, min.y - 1));

        if (max.y + 1 < world.size.y)
            merge(new Vector(x, max.y + 1));
    }

    for (let y = min.y; y <= max.y; y++) {
        if (min.x > 0)
            merge(new Vector(min.x - 1, y));

        if (max.x + 1 < world.size.x)
            merge(new Vector(max.x + 1, y));
    }

    tiles = tiles.filter(tile => {
        let same = tiles.find(t => Vector.equals(t, tile));
        return same == tile;
    });

    region.addTile(...tiles);

    regions.addRegion(region);
}

function destroy() {
    let { min, max } = compute();

    for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
            let v = new Vector(x, y);

            let region = regions.getRegion(v);
            if (region == null) continue;

            region.removeTile(v);
        }
    }
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
