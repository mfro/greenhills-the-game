import * as pixi from 'pixi.js';

import * as app from 'app';
import * as mouse from 'input/mouse';
import * as keyboard from 'input/keyboard';
import * as camera from 'camera';

import * as world from 'world';
import * as blocks from 'world/blocks';
import * as objects from 'world/objects';
import * as foundations from 'world/foundations';

import Vector from 'math/vector';
import * as materials from 'world/materials';

import * as construction from 'construction';

import * as jobs from './job';

let start: Vector;
let end: Vector;
let action: (v: Vector) => jobs.Base;
let direction = Vector.right;

let graphics = new pixi.Graphics();

let hover = new pixi.Container();
let hoverSprite = new pixi.Sprite();
let hoverGraphics = new pixi.Graphics();

hover.addChildAt(hoverGraphics, 0);
hover.addChildAt(hoverSprite, 1);

export let material: materials.Base = null;

export function setMaterial(mat: materials.Base) {
    material = mat;
}

mouse.on('down', 1000, e => {
    if (e.handled) return;
    if (material == null) return;

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

    for (let x = min.x; x <= max.x; x++) {
        for (let y = min.y; y <= max.y; y++) {
            let job = action(new Vector(x, y));
            if (!job) continue;

            batch.push(job);
        }
    }

    batch = batch.filter(j => batch.find(j2 => j2.position.equals(j.position)) == j);

    construction.addJobs(batch);

    e.handled = true;
});

keyboard.on('down', key => {
    let array = [
        Vector.up,
        Vector.left,
        Vector.down,
        Vector.right
    ];

    let index = array.indexOf(direction);

    if (key == keyboard.Q)
        index++;
    else if (key == keyboard.E)
        index++;
    else return;

    index = index % array.length;
    while (index < 0) index += array.length;

    direction = array[index];
});

app.hook('prerender', 'construction/controls', () => {
    hover.alpha = (material && !start) ? 1 : 0;

    if (material == null) return;

    if (start == null) {
        let tile = camera.transform(mouse.position).apply(Math.floor);

        hoverSprite.alpha = 0.5;
        hoverSprite.position = tile.toPoint();

        hoverGraphics.clear();

        hoverGraphics.beginFill(0xFFFFFF, 0.2);
        if (material instanceof materials.Object) {
            let w = (direction == Vector.up || direction == Vector.down) ? material.width : material.height;
            let h = (direction == Vector.up || direction == Vector.down) ? material.height : material.width;

            hoverSprite.width = w;
            hoverSprite.height = h;
            
            hoverSprite.texture = material.getTexture(direction);

            hoverGraphics.drawRect(tile.x, tile.y, w, h);
        } else {
            hoverSprite.width = hoverSprite.height = 1;
            hoverSprite.texture = material.thumbnail;

            hoverGraphics.drawRect(tile.x, tile.y, 1, 1);
        }

        hoverGraphics.endFill();
    } else {
        let { min, max } = compute();

        graphics.clear();
        graphics.beginFill(0xFF0000, 0.5);
        graphics.drawRect(min.x, min.y, max.x - min.x + 1, max.y - min.y + 1);
        graphics.endFill();
    }
});

app.hook('init', 'construction/controls', () => {
    camera.addObject(graphics, 1000);

    camera.addObject(hover, 100);
});

function place(v: Vector): jobs.Base {
    let dir = direction;

    if (!material.isPlaceable(v))
        return;

    if (material instanceof materials.Object) {
        for (let x = v.x; x < v.x + (dir == Vector.up || dir == Vector.down ? material.width : material.height); x++) {
            for (let y = v.y; y < v.y + (dir == Vector.up || dir == Vector.down ? material.height : material.width); y++) {
                if (construction.getJob(new Vector(x, y)) != null)
                    return;
            }
        }
    } else {
        if (construction.getJob(v) !== null)
            return;
    }

    if (material == materials.BULLDOZER) {
        let object = objects.getObject(v);

        if (object != null) {
            return new jobs.DemolishObject(object.position);
        }
    }

    else if (material == materials.AIR) {
        if (blocks.getTile(v).material == material)
            return;

        return new jobs.DemolishBlock(v);
    }

    else if (material instanceof materials.Block) {
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
        let job = new jobs.BuildObject(material, v, dir);

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

    if (material instanceof materials.Object && action == place && material !== materials.BULLDOZER) {
        end = start;
    }

    end = end.apply(Math.floor);

    let min = new Vector(Math.min(start.x, end.x), Math.min(start.y, end.y));
    let max = new Vector(Math.max(start.x, end.x), Math.max(start.y, end.y));

    min = min.apply(v => Math.clamp(v, 0, world.size.x - 1));
    max = max.apply(v => Math.clamp(v, 0, world.size.x - 1));

    return { min, max };
}
