"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return Queue;
    }
});
var _LinkedArray = /*#__PURE__*/ _interop_require_default(require("./LinkedArray.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function Queue(parallelism) {
    if (typeof parallelism === 'undefined') parallelism = Infinity;
    var awaitCalled = false;
    var awaitCallback = null;
    function callAwait() {
        if (awaitCalled || !awaitCallback) return;
        awaitCalled = true;
        return awaitCallback(error);
    }
    var tasks = new _LinkedArray.default();
    var runningCount = 0;
    var error = null;
    function queueCallback(err) {
        runningCount--;
        if (err && !error) error = err;
        if (error || !(tasks.length + runningCount)) return callAwait();
        if (!tasks.length) return;
        runningCount++;
        tasks.shift()(queueCallback);
    }
    return {
        defer: function defer(deferFn) {
            if (error) return;
            if (runningCount < parallelism) {
                runningCount++;
                deferFn(queueCallback);
            } else tasks.push(deferFn);
        },
        await: function awaitFn(callback) {
            if (awaitCallback) throw new Error("Awaiting callback was added twice: ".concat(callback));
            awaitCallback = callback;
            if (error || !(tasks.length + runningCount)) return callAwait();
        }
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }