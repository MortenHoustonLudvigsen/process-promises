var _resolve = require('resolve');
var Q = require('q');
function resolve(id, opts) {
    var deferred = Q.defer();
    _resolve(id, opts, function (err, res) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(res);
        }
    });
    return deferred.promise;
}
exports.resolve = resolve;
//# sourceMappingURL=resolve-promise.js.map