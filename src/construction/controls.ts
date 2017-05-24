import * as pixi from 'pixi.js';

import * as app from 'app';
import * as mouse from 'input/mouse';
import * as camera from 'camera';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import * as materials from 'world/materials';

import * as construction from 'construction';

import * as jobs from './job';

let start: Vector;
let end: Vector;
let action: (v: Vector) => jobs.Base;

let graphics = new pixi.Graphics();

export let material: materials.Base = materials.CINDERBLOCK_WALL;

export function setMaterial(mat: materials.Base) {
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
            action = place;
            break;

        case 2:
            action = cancel;
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

    let batch = Array<jobs.Base>();
    let mat: materials.Base;

    // if (action == Action.PLACE)
    //     mat = material;

    // else if (material instanceof materials.Block)
    //     mat = materials.AIR;

    // else if (material instanceof materials.Foundation)
    //     mat = materials.DIRT;

    // else if (material instanceof materials.Object)
    //     mat = null;

    for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
            let job = action(new Vector(x, y));
            if (!job) continue;

            batch.push(job);
        }
    }

    construction.addJobs(batch);

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

function place(v: Vector): jobs.Base {
    if (!material.isPlaceable(v))
        return;

    if (construction.getJob(v) !== null)
        return;

    if (material instanceof materials.Block) {
        if (blocks.getTile(v).material == material)
            return;

        return new jobs.BuildBlock(material, v);
    }

    else if (material instanceof materials.Foundation) {
        if (foundations.getTile(v).material == material)
            return;

        return new jobs.BuildFoundation(material, v);
    }

    else if (material instanceof materials.Object) {
        let job = new jobs.BuildObject(material, v, Vector.right);

        let success = true;
        for (let x = job.position.x; success && x < job.position.x + job.size.x; x++) {
            for (let y = job.position.y; success && y < job.position.y + job.size.y; y++) {
                success = world.isPassable(new Vector(x, y));
            }
        }

        return success ? job : undefined;
    }
}

function cancel(v: Vector): jobs.Base {
    let job = construction.getJob(v);

    if (job == null) return;

    construction.cancel(job);
}

function compute() {
    end = camera.transform(mouse.position);

    if (material instanceof materials.Wall && action == place) {
        let diag = end.add(start.scale(-1));
        if (Math.abs(diag.x) > Math.abs(diag.y))
            end = new Vector(end.x, start.y);

        else
            end = new Vector(start.x, end.y);
    }

    if (material instanceof materials.Object && action == place) {
        end = start;
    }

    end = end.apply(Math.floor);

    let min = new Vector(Math.min(start.x, end.x), Math.min(start.y, end.y));
    let max = new Vector(Math.max(start.x, end.x), Math.max(start.y, end.y));

    min = min.apply(v => Math.clamp(v, 0, world.size.x - 1));
    max = max.apply(v => Math.clamp(v, 0, world.size.x - 1));

    return { min, max };
}
