import * as pixi from 'pixi.js';

import { EventEmitter } from 'eventemitter3';

interface Listener {
    done: boolean;
    name: string;
    after: string[];
    callback: ApplicationEventCallback<any>;
}

const events = new Map<string, Array<Listener>>();

interface ApplicationEvents {
    preload: void;
    init: void;
    start: void;

    update: number;
    prerender: void;
    postrender: void;
}

interface ApplicationEventCallback<T extends keyof ApplicationEvents> {
    (v: ApplicationEvents[T]): void
}

declare type HookArgs = { name: string, after: string[] };

export const width = window.innerWidth;
export const height = window.innerHeight;

let app = new pixi.Application(width, height);

export let stage = app.stage;
export let canvas = app.view;

export function hook<T extends keyof ApplicationEvents>(e: T, name: string, callback: ApplicationEventCallback<T>): void
export function hook<T extends keyof ApplicationEvents>(e: T, arg: HookArgs, callback: ApplicationEventCallback<T>): void
export function hook<T extends keyof ApplicationEvents>(e: T, arg: string | HookArgs, callback: ApplicationEventCallback<T>) {
    let name: string, after: string[];

    if (typeof arg == 'string') {
        name = arg;
        after = [];
    } else {
        name = arg.name;
        after = arg.after;
    }

    let list = events.get(e);
    if (!list) events.set(e, list = []);

    list.push({
        done: false,
        name: name,
        after: after || [],
        callback: callback
    });
}

function emit<T extends keyof ApplicationEvents>(e: T, arg: ApplicationEvents[T]) {
    let list = events.get(e);
    if (!list) return;

    for (let item of list) {
        call(list, item, arg);
    }

    for (let item of list) {
        item.done = false;
    }
}

function call(list: Listener[], item: Listener, arg: any) {
    if (item.done) return;

    for (let name of item.after) {
        let dep = list.find(a => a.name == name);
        if (!dep) {
            console.error(`Dependency ${name} not found on ${item.name}`);
            continue;
        }
        call(list, dep, arg);
    }

    item.done = true;
    item.callback(arg);
}

window.addEventListener('load', () => {
    app.renderer.backgroundColor = 0xFFFFFF;

    app.view.addEventListener('contextmenu', e => e.preventDefault());

    document.body.appendChild(app.view);

    emit('preload', null);

    pixi.loader.load(() => {
        emit('init', null);

        let lastTick = performance.now();
        app.ticker.add(dT => {
            let now = performance.now();

            emit('update', (now - lastTick) / 1000);

            lastTick = now;
        });

        app.renderer.on('prerender', () => emit('prerender', null));
        app.renderer.on('postrender', () => emit('postrender', null));
    });
});
