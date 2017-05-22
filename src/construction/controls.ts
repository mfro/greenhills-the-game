import * as pixi from 'pixi.js';

import * as app from 'app';
import * as mouse from 'input/mouse';
import * as camera from 'camera';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import Material from 'world/material';

import * as construction from 'construction';

import Job from './job';

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

mouse.on('down', 1000, e => {
    if (e.handled) return;

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

    e.handled = true;
});

mouse.on('up', 1000, e => {
    if (e.handled) return;

    if (!start) return;

    let { min, max } = compute();

    start = null;
    graphics.clear();

    let jobs = Array<Job>();
    switch (action) {
        case Action.PLACE:
            for (let x = min.x; x <= max.x; x++) {
                for (let y = min.y; y <= max.y; y++) {
                    if (material instanceof blocks.Material &&
                        blocks.getTile(x, y).material == material)
                        continue;

                    if (material instanceof foundations.Material &&
                        foundations.getTile(x, y).material == material)
                        continue;

                    if (construction.pending.filter(f => f.position.equals(new Vector(x, y)) && f.material == material).length > 0)
                        continue;

                    jobs.push(new Job(
                        material,
                        new Vector(x, y)
                    ));
                }
            }
            break;

        case Action.DESTROY:
            for (let x = min.x; x <= max.x; x++) {
                for (let y = min.y; y <= max.y; y++) {
                    let mat: Material;

                    if (material instanceof blocks.Material) {
                        if (blocks.getTile(x, y).material == blocks.Material.AIR)
                            continue;
                        
                        mat = blocks.Material.AIR;
                    }

                    else if (material instanceof foundations.Material) {
                        if (foundations.getTile(x, y).material == foundations.Material.DIRT)
                            continue;
                        
                        mat = foundations.Material.DIRT;
                    }

                    if (construction.pending.filter(f => f.position.equals(new Vector(x, y)) && f.material == mat).length > 0)
                        continue;

                    jobs.push(new Job(
                        mat,
                        new Vector(x, y)
                    ));
                }
            }
            break;
    }

    construction.addJobs(jobs);

    e.handled = true;
});

app.hook('prerender', 'construction/controls', () => {
    if (!start) return;

    let { min, max } = compute();

    graphics.clear();
    graphics.beginFill(0xFF0000, 0.5);
    graphics.drawRect(min.x, min.y, max.x - min.x + 1, max.y - min.y + 1);
    graphics.endFill();
});

app.hook('init', 'construction/controls', () => {
    camera.addObject(graphics, 1000);
});

function compute() {
    end = camera.transform(mouse.position);

    if (material.type == Material.Type.Wall && action == Action.PLACE) {
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
