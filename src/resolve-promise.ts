import _resolve = require('resolve');
import Promise = require('bluebird');

export function resolve(id: string, opts: _resolve.ResolveOptions): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		_resolve(id, opts, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}