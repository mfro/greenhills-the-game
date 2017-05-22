declare module "eventemitter3" {
    type ListenerFn<T, E extends keyof T> = (e: T[E]) => void;

    /**
     * Minimal `EventEmitter` interface that is molded against the Node.js
     * `EventEmitter` interface.
     */
    export class EventEmitter<T> {
        static prefixed: string | boolean;

        /**
         * Return an array listing the events for which the emitter has registered
         * listeners.
         */
        eventNames(): Array<string | symbol>;

        /**
         * Return the listeners registered for a given event.
         */
        listeners<E extends keyof T>(event: E, exists: boolean): Array<ListenerFn<T, E>> | boolean;
        listeners<E extends keyof T>(event: E): Array<ListenerFn<T, E>>;

        /**
         * Calls each of the listeners registered for a given event.
         */
        emit<E extends keyof T>(event: E, arg?: T[E]): boolean;

        /**
         * Add a listener for a given event.
         */
        on<E extends keyof T>(event: E, fn: ListenerFn<T, E>, context?: any): this;
        addListener<E extends keyof T>(event: E, fn: ListenerFn<T, E>, context?: any): this;

        /**
         * Add a one-time listener for a given event.
         */
        once<E extends keyof T>(event: E, fn: ListenerFn<T, E>, context?: any): this;

        /**
         * Remove the listeners of a given event.
         */
        removeListener<E extends keyof T>(event: E, fn?: ListenerFn<T, E>, context?: any, once?: boolean): this;
        off<E extends keyof T>(event: E, fn?: ListenerFn<T, E>, context?: any, once?: boolean): this;

        /**
         * Remove all listeners, or those of the specified event.
         */
        removeAllListeners<E extends keyof T>(event?: E): this;
    }
}