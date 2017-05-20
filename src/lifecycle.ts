import { EventEmitter } from 'eventemitter3';

interface Listener {
    done: boolean;
    name: string;
    after: string[];
    callback: Callback;
}

const events = new Map<string, Array<Listener>>();

interface ApplicationEvents {
    init: PIXI.Application;
    start: void
}

interface ApplicationEventCallback<T extends keyof ApplicationEvents> {
    (v: ApplicationEvents[T]): void
}

declare type ApplicationEvent = 'init' | 'start';
declare type Callback = (app: PIXI.Application) => void;
declare type HookArgs = { name: string, after: string[] };

export let app: PIXI.Application;

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

export function emit<T extends keyof ApplicationEvents>(e: T, arg: ApplicationEvents[T]) {
    if (e == 'init')
        app = arg as PIXI.Application;

    let list = events.get(e);
    if (!list) return;

    for (let item of list) {
        call(list, item, app);
    }
}

function call(list: Listener[], item: Listener, app: PIXI.Application) {
    if (item.done) return;

    for (let name of item.after) {
        let dep = list.find(a => a.name == name);
        if (!dep) {
            console.error(`Dependency ${name} not found on ${item.name}`);
            continue;
        }
        call(list, dep, app);
    }

    console.debug('Applying ' + item.name);
    item.done = true;
    item.callback(app);
}
