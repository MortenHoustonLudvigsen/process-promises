var _resolve = require('resolve');
var Promise = require('bluebird');
function resolve(id, opts) {
    return new Promise(function (resolve, reject) {
        _resolve(id, opts, function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                resolve(res);
            }
        });
    });
}
exports.resolve = resolve;
//# sourceMappingURL=resolve-promise.js.map