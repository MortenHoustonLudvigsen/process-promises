import _resolve = require('resolve');
import Promise = require('bluebird');
export declare function resolve(id: string, opts: _resolve.ResolveOptions): Promise<string>;
