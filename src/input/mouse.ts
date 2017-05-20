import * as app from 'app';

import Vector from 'math/vector';

import { EventEmitter } from 'eventemitter3';

interface Events {
    scroll: number;

    down: MouseButtonEvent;
    up: MouseButtonEvent;
}

interface Callback<T extends keyof Events> {
    (arg: Events[T]): void;
}

interface EventHandler {
    priority: number;
    callback: Callback<any>;
}

export interface MouseEvent {
    type: string;
    handled: boolean;
    position: Vector;
}

export interface MouseButtonEvent extends MouseEvent {
    button: number;
}

let node: HTMLCanvasElement;
let events = new Map<string, Array<EventHandler>>();

app.hook('init', 'mouse', () => {
    node = app.canvas;

    node.addEventListener('mousemove', e => {
        position = new Vector(e.offsetX, e.offsetY);
    });

    node.addEventListener('mousedown', e => {
        position = new Vector(e.offsetX, e.offsetY);

        emit('down', {
            type: 'down',
            button: e.button,
            handled: false,
            position
        });
    });

    node.addEventListener('mouseup', e => {
        position = new Vector(e.offsetX, e.offsetY);
        
        emit('up', {
            type: 'up',
            button: e.button,
            handled: false,
            position
        });
    });

    node.addEventListener('mousewheel', e => {
        emit('scroll', e.deltaY);
    });
});

export let position = new Vector();

export function on<T extends keyof Events>(e: T, priority: number, callback: Callback<T>) {
    let list = events.get(e);
    if (!list) events.set(e, list = []);

    list.push({ priority, callback });

    list.sort((a, b) => a.priority - b.priority);
}

function emit<T extends keyof Events>(e: T, arg: Events[T]) {
    let list = events.get(e);
    if (!list) return;

    for (let handler of list) {
        handler.callback(arg);
    }
}