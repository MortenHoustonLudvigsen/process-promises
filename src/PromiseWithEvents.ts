import * as events from 'events';
import Promise = require('bluebird');

export class PromiseWithEvents<T> extends Promise<T> {
    constructor(callback: (resolve: (thenableOrResult?: T | Promise.Thenable<T>) => void, reject: (error: any) => void, eventEmitter: NodeJS.EventEmitter) => void) {
        this._events = new events.EventEmitter();
        var promise = new Promise<T>((resolve, reject) => callback(resolve, reject, this._events));
        promise['_events'] = this._events;
        promise['on'] = this.on;
        promise['once'] = this.once;
        return <PromiseWithEvents<T>>promise;
        super(undefined); // Ignored - need this for compile to succeed
    }

    private _events: NodeJS.EventEmitter;
    
    // Events
    on(event: string, listener: Function): PromiseWithEvents<T> {
        this._events.on(event, listener);
        return this;
    }
    
    once(event: string, listener: Function): PromiseWithEvents<T>{
        this._events.once(event, listener);
        return this;
    }
}
