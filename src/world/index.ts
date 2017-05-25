import * as pixi from 'pixi.js';

import * as app from 'app'
import * as materials from './materials';

import * as blocks from './blocks'
import * as objects from './objects';
import * as foundations from './foundations';

import * as entities from './entities';

import * as construction from 'construction';
import * as jobs from 'construction/job';

import { EventEmitter } from 'eventemitter3';

import Vector from 'math/vector';

export const size = new Vector(100, 100);

export let cash = 5000;

export function setCash(c: number) {
    cash = c;
}

const events = new EventEmitter<{
    change: Vector;
}>();

export const on = events.on;
export const once = events.once;

export function isPassable(tile: Vector) {
    let block = blocks.getTile(tile);
    if (block.material.isSolid)
        return false;

    let obj = objects.getObject(tile);
    if (obj != null)
        return false;

    return true;
}

blocks.on('change', update);
objects.on('change', update);
entities.on('change', update);
foundations.on('change', update);

function update(pos: Vector) {
    for (let x = Math.max(0, pos.x - 1); x < Math.min(size.x, pos.x + 2); x++) {
        for (let y = Math.max(0, pos.y - 1); y < Math.min(size.y, pos.y + 2); y++) {
            let v = new Vector(x, y);

            blocks.update(v);
            foundations.update(v);
        }
    }

    events.emit('change', pos);
}

export function change() {
    setImmediate(() => events.emit('change', new Vector()));
}

interface SaveObject {
    material: materials.Base;
    position: Vector;
    direction: Vector;
}

interface Save {
    objects: Array<SaveObject>;
    blocks: Array<Array<materials.Base>>;
    foundations: Array<Array<materials.Base>>;

    jobs: Array<any>;
}

app.hook('init', 'load-world', load);
function load() {
    let json = localStorage.getItem('GreenhillsTheGame.Save');
    if (!json) return;

    let save = <Save>JSON.parse(json, (key, value) => {
        if (!value) return value;

        if (value.type == 'vector')
            return new Vector(value.x, value.y);

        if (value.type == 'material')
            return materials.getMaterial(value.id);

        return value;
    });

    for (let x = 0; x < size.x; x++) {
        for (let y = 0; y < size.y; y++) {
            blocks.setTile(x, y, <materials.Block>save.blocks[x][y]);
            foundations.setTile(x, y, <materials.Foundation>save.foundations[x][y]);
        }
    }

    for (let raw of save.objects) {
        let mat = <materials.Object>raw.material;

        let dir: Vector;
        if (raw.direction.x == 1)
            dir = Vector.right;

        if (raw.direction.x == -1)
            dir = Vector.left;

        if (raw.direction.y == -1)
            dir = Vector.up;

        if (raw.direction.y == 1)
            dir = Vector.down;

        let obj = new mat.type(new Vector(raw.position.x, raw.position.y), dir);

        objects.addObject(obj);
    }

    let list = new Array<jobs.Base>();
    for (let raw of save.jobs) {
        let type = (<any>jobs)[raw.type];
        let job = type.deserialize(raw);
        job.progress = raw.progress;
        job.state = jobs.State.WAITING;
        list.push(job);
    }
    construction.addJobs(list, false);
}

window.addEventListener('beforeunload', save);
function save() {
    let save = {
        jobs: Array<any>(),
        blocks: Array<Array<materials.Base>>(),
        foundations: Array<Array<materials.Base>>(),
        objects: Array<SaveObject>(),
    };

    for (let x = 0; x < size.x; x++) {
        save.blocks[x] = [];
        save.foundations[x] = [];

        for (let y = 0; y < size.y; y++) {
            save.blocks[x][y] = blocks.getTile(x, y).material;
            save.foundations[x][y] = foundations.getTile(x, y).material;
        }
    }

    for (let obj of objects.allObjects) {
        save.objects.push({
            material: obj.material,
            position: obj.position,
            direction: obj.direction
        });
    }

    for (let job of construction.active) {
        save.jobs.push(job.serialize());
    }

    let json = JSON.stringify(save, (key, value) => {
        if (value instanceof Vector)
            return { type: 'vector', x: value.x, y: value.y };

        if (value instanceof materials.Base)
            return { type: 'material', id: value.id };

        return value;
    });

    localStorage.setItem('GreenhillsTheGame.Save', json);
}

window.addEventListener('keydown', e => {
    if (e.keyCode == 88) save();
    if (e.keyCode == 80) localStorage.removeItem('GreenhillsTheGame.Save');
});