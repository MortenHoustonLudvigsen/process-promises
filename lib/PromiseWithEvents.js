var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events = require('events');
var Promise = require('bluebird');
/*
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}

export interface EventEmitter<T extends events.EventEmitter> extends NodeJS.EventEmitter {
    addListener(event: string, listener: Function): EventEmitter<T>;
    on(event: string, listener: Function): EventEmitter<T>;
    once(event: string, listener: Function): EventEmitter<T>;
    removeListener(event: string, listener: Function): EventEmitter<T>;
    removeAllListeners(event?: string): EventEmitter<T>;
}
*/
var PromiseWithEvents = (function (_super) {
    __extends(PromiseWithEvents, _super);
    function PromiseWithEvents(callback) {
        var _this = this;
        this._events = new events.EventEmitter();
        var promise = new Promise(function (resolve, reject) { return callback(resolve, reject, _this._events); });
        promise['_events'] = this._events;
        promise['on'] = this.on;
        promise['once'] = this.once;
        return promise;
        _super.call(this, undefined);
    }
    // Events
    PromiseWithEvents.prototype.on = function (event, listener) {
        this._events.on(event, listener);
        return this;
    };
    PromiseWithEvents.prototype.once = function (event, listener) {
        this._events.once(event, listener);
        return this;
    };
    return PromiseWithEvents;
})(Promise);
exports.PromiseWithEvents = PromiseWithEvents;
//applyMixins(PromiseWithEvents, [events.EventEmitter]);
//# sourceMappingURL=PromiseWithEvents.js.map