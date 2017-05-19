import Vector from 'math/vector';
import * as lifecycle from 'lifecycle';

import { EventEmitter } from 'eventemitter3';

interface Events {
    scroll: number;

    down: MouseButtonEvent;
    up: MouseButtonEvent;
}

interface Callback<T extends keyof Events> {
    (arg: Events[T]): void;
}

export interface MouseEvent {
    type: string;
    position: Vector;
}

export interface MouseButtonEvent extends MouseEvent {
    button: number;
}

let node: HTMLCanvasElement;
let events = new EventEmitter();

lifecycle.hook('init', 'mouse', app => {
    node = app.view;

    node.addEventListener('mousemove', e => {
        position = new Vector(e.offsetX, e.offsetY);
    });

    node.addEventListener('mousedown', e => {
        position = new Vector(e.offsetX, e.offsetY);

        events.emit('down', {
            type: 'down',
            button: e.button,
            position
        });
    });

    node.addEventListener('mouseup', e => {
        position = new Vector(e.offsetX, e.offsetY);
        
        events.emit('up', {
            type: 'up',
            button: e.button,
            position
        });
    });

    node.addEventListener('mousewheel', e => {
        events.emit('scroll', e.deltaY);
    });
});

export let position = new Vector();

export function on<T extends keyof Events>(e: T, cb: Callback<T>, context?: any) {
    events.on(e, cb, context);
}