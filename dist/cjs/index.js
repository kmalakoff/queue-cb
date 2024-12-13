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
        this._state = {
            parallelism: parallelism,
            tasks: new _LinkedArray.default(),
            runningCount: 0,
            error: null,
            awaitCallback: null,
            awaitCalled: false
        };
        this._callAwait = this._callAwait.bind(this);
        this._callDefer = this._callDefer.bind(this);
    }
    var _proto = Queue.prototype;
    _proto._callAwait = function _callAwait() {
        if (this._state.awaitCalled || !this._state.awaitCallback) return;
        this._state.awaitCalled = true;
        return this._state.awaitCallback(this._state.error);
    };
    _proto._callDefer = function _callDefer(err) {
        this._state.runningCount--;
        if (err && !this._state.error) this._state.error = err;
        if (this._state.error || !(this._state.tasks.length + this._state.runningCount)) return this._callAwait();
        if (!this._state.tasks.length) return;
        this._state.runningCount++;
        this._state.tasks.shift()(this._callDefer);
    };
    _proto.defer = function defer(defer) {
        if (this._state.error) return;
        if (this._state.runningCount < this._state.parallelism) {
            this._state.runningCount++;
            defer(this._callDefer);
        } else this._state.tasks.push(defer);
    };
    _proto.await = function _await(callback) {
        if (this._state.awaitCallback) throw new Error("Awaiting callback was added twice: ".concat(callback));
        this._state.awaitCallback = callback;
        if (this._state.error || !(this._state.tasks.length + this._state.runningCount)) return this._callAwait();
    };
    return Queue;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }