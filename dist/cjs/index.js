// @ts-ignore
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
var _LinkedArrayts = /*#__PURE__*/ _interop_require_default(require("./LinkedArray.js"));
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var Queue = /*#__PURE__*/ function() {
    "use strict";
    function Queue() {
        var parallelism = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Infinity;
        _class_call_check(this, Queue);
        this.parallelism = parallelism;
        this.awaitCallback = null;
        this.tasks = new _LinkedArrayts.default();
        this.runningCount = 0;
        this.error = null;
        var awaitCalled = false;
        this.callAwait = (function callAwait() {
            if (awaitCalled || !this.awaitCallback) return;
            awaitCalled = true;
            return this.awaitCallback(this.error);
        }).bind(this);
        this.callDefer = (function callDefer(err) {
            this.runningCount--;
            if (err && !this.error) this.error = err;
            if (this.error || !(this.tasks.length + this.runningCount)) return this.callAwait();
            if (!this.tasks.length) return;
            this.runningCount++;
            this.tasks.shift()(this.callDefer);
        }).bind(this);
    }
    var _proto = Queue.prototype;
    _proto.defer = function defer(defer) {
        if (this.error) return;
        if (this.runningCount < this.parallelism) {
            this.runningCount++;
            defer(this.callDefer);
        } else this.tasks.push(defer);
    };
    _proto.await = function _await(callback) {
        if (this.awaitCallback) throw new Error("Awaiting callback was added twice: ".concat(callback));
        this.awaitCallback = callback;
        if (this.error || !(this.tasks.length + this.runningCount)) return this.callAwait();
    };
    return Queue;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }