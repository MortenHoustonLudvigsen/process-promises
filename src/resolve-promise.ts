import _resolve = require('resolve');
import * as Q from 'q';

export function resolve(id: string, opts: _resolve.ResolveOptions): Q.Promise<string> {
	let deferred = Q.defer<string>();

	_resolve(id, opts, (err, res) => {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(res);
		}
	});

	return deferred.promise;
}