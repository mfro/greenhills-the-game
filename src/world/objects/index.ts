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

const objects = new Array<GameObject>();
const container = new pixi.Container();

export const on = events.on;
export const once = events.once;

export function addObject(obj: GameObject) {
    objects.push(obj);

    container.addChildAt(obj.container, 0);
}

export function getObject(tile: Vector) {
    return objects.find(o => {
        return tile.x >= o.position.x && tile.x < o.position.x + o.size.x &&
            tile.y >= o.position.y && tile.y < o.position.y + o.size.y;
    });
}

app.hook('init', 'blocks', () => {
    camera.addObject(container, 1);
});