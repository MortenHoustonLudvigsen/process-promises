import Promise = require('bluebird');
export declare class PromiseWithEvents<T> extends Promise<T> {
    constructor(callback: (resolve: (thenableOrResult?: T | Promise.Thenable<T>) => void, reject: (error: any) => void, eventEmitter: NodeJS.EventEmitter) => void);
    private _events;
    on(event: string, listener: Function): PromiseWithEvents<T>;
    once(event: string, listener: Function): PromiseWithEvents<T>;
}
