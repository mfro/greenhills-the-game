import Entity from './entity';

import { EventEmitter } from 'eventemitter3';

interface Events<T> {
    state: T;
}

type EventsSource<T, E extends keyof T> = {
    on(e: E, callback: (v: T[E]) => void): any;
}

interface Definition {
    [id: number]: {
        callback: () => void,
        listen?: {
            [id: string]: { on: Function }
        }
    }
}

class AI<E extends Entity, S extends number> extends EventEmitter<Events<S>> {
    private _state: S;

    public readonly entity: E;

    constructor(entity: E, start: S) {
        super();

        this._state = start;
        this.entity = entity;

        setImmediate(() => this.pulse());
    }

    public get state() { return this._state; }
    public set state(t: S) {
        this._state = t;

        setImmediate(() => this.pulse());
    }

    public onState(state: S, callback: () => void, context?: any) {
        if (context !== undefined) callback = callback.bind(context);

        this.on('state', s => {
            if (s == state) {
                callback();
            }
        });
    }

    protected pulse() {
        this.emit('state', this.state);
    }

    protected switch(args: { [id: number]: () => void }) {
        return () => {
            let cb = args[Number(this.state)];
            if (cb) cb.bind(this)();
        };
    }

    protected if<F extends Function>(state: S, fn: F) {
        return <F><any>((...a: any[]) => {
            if (this.state != state) return;

            fn.bind(this)(...a);
        });
    }

    protected listen(def: { [id: number]: any }) {
        for (let key in def) {
            let state = Number(key) as S;
            let args = def[key];

            let func = () => {
                if (this.state != state) return;

                this.emit('state', this.state);
                // args.callback();
            };

            for (let e in args) {
                let src = args[e];
                src.on(e, func);
            }
        }
    }

    protected define(def: Definition) {
        for (let key in def) {
            let state = Number(key) as S;
            let args = def[key];

            let func = () => {
                if (this.state != state) return;

                args.callback();
            };

            this.on('state', func);

            for (let e in args.listen || {}) {
                let src = args.listen[e];
                src.on(e, func);
            }
        }
    }
    // public on<S, E extends keyof S>(src: EventsSource<S, E>, e: E, state: T, callback: (v: S[E]) => void): this
    // public on<E extends keyof Events<T>>(event: E, fn: (a: Events<T>[E]) => void, context?: any): this;
    // public on(a: any, b: any, c?: any, d?: any) {
    //     if (typeof a == 'string')
    //         return super.on(a as any, b, c);

    //     a.on(b, (arg: any) => {
    //         if (this.state != c) return;

    //         d(arg);
    //     });

    //     return this;
    // }
}

export default AI;