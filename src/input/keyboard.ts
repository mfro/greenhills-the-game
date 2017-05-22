import { EventEmitter } from 'eventemitter3';

const pressed = new Set<number>();

const events = new EventEmitter<{
    down: number;
    up: number;  
}>();

declare type KeyEvent = 'down' | 'up';

export const
    SPACE = 32,

    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40,

    W = 87,
    A = 65,
    S = 83,
    D = 68;

export const on = events.on;
export const once = events.once;

export function isPressed(keys: number) {
    return pressed.has(keys);
}

window.addEventListener('keydown', e => {
    if (pressed.has(e.keyCode)) return;

    console.log(e.keyCode);

    events.emit('down', e.keyCode);
    pressed.add(e.keyCode);
});

window.addEventListener('keyup', e => {
    events.emit('up', e.keyCode);
    pressed.delete(e.keyCode);
});