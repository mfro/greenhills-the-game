import * as pixi from 'pixi.js';
import * as mouse from 'input/mouse';
import * as camera from 'camera';
import * as lifecycle from 'lifecycle';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as foundation from 'world/foundations';

import Material from 'world/material';

import Vector from 'math/vector';

enum Action {
    PLACE,
    DESTROY,
}

let start: Vector;
let end: Vector;
let action: Action;

let graphics = new pixi.Graphics();

export let material: Material = blocks.Material.CONCRETE;

export function setMaterial(mat: Material) {
    material = mat;
}

camera.addObject(graphics, 1000);

mouse.on('down', e => {
    if (start) {
        start = null;
        graphics.clear();
        return;
    }

    switch (e.button) {
        case 0:
            action = Action.PLACE;
            break;

        case 2:
            action = Action.DESTROY;
            break;

        default: return;
    }

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

    switch (action) {
        case Action.PLACE:
            for (let x = min.x; x <= max.x; x++) {
                for (let y = min.y; y <= max.y; y++) {
                    if (material.type == Material.Type.BLOCK)
                        blocks.setTile(x, y, material as blocks.Material);

                    else if (material.type == Material.Type.WALL)
                        blocks.setTile(x, y, material as blocks.Material);

                    else if (material.type == Material.Type.FOUNDATION)
                        foundation.setTile(x, y, material as foundation.Material);
                }
            }
            break;

        case Action.DESTROY:
            for (let x = min.x; x <= max.x; x++) {
                for (let y = min.y; y <= max.y; y++) {
                    if (material.type == Material.Type.BLOCK)
                        blocks.setTile(x, y, null);

                    else if (material.type == Material.Type.WALL)
                        blocks.setTile(x, y, null);

                    else if (material.type == Material.Type.FOUNDATION)
                        foundation.setTile(x, y, foundation.Material.DIRT);
                }
            }
            break;
    }

    if (e.button == 0) {
        // for (let x = min.x; x <= max.x; x++) {
        //     blocks.setTile(x, min.y, blocks.Material.CONCRETE);
        //     blocks.setTile(x, max.y, blocks.Material.CONCRETE);
        // }

        // for (let y = min.y + 1; y <= max.y - 1; y++) {
        //     blocks.setTile(min.x, y, blocks.Material.CONCRETE);
        //     blocks.setTile(max.x, y, blocks.Material.CONCRETE);
        // }

    } else if (e.button == 2) {
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

    if (material.type == Material.Type.WALL && action == Action.PLACE) {
        let diag = end.add(start.scale(-1));
        if (Math.abs(diag.x) > Math.abs(diag.y))
            end = new Vector(end.x, start.y);

        else
            end = new Vector(start.x, end.y);
    }

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