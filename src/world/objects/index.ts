import * as pixi from 'pixi.js';

import * as app from 'app';
import * as camera from 'camera';

import * as world from 'world';

import Vector from 'math/vector';
import GameObject from './object';
import { EventEmitter } from 'eventemitter3';

const events = new EventEmitter<{
    change: Vector;
}>();

export const allObjects = new Array<GameObject>();
const container = new pixi.Container();

export const on = events.on;
export const once = events.once;

export function addObject(obj: GameObject) {
    allObjects.push(obj);

    container.addChildAt(obj.container, 0);

    events.emit('change', obj.position);
}

export function removeObject(obj: GameObject) {
    let index = allObjects.indexOf(obj);
    if (index < 0) return;

    allObjects.splice(index, 1);

    container.removeChild(obj.container);

    events.emit('change', obj.position);
}

export function getObject(tile: Vector) {
    return allObjects.find(o => {
        return tile.x >= o.position.x && tile.x < o.position.x + o.size.x &&
            tile.y >= o.position.y && tile.y < o.position.y + o.size.y;
    });
}

app.hook('init', 'objects', () => {
    camera.addObject(container, 1);
});