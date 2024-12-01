// stripped down version of https://github.com/mafintosh/fifo
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return LinkedArray;
    }
});
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Node = /*#__PURE__*/ function() {
    "use strict";
    function Node(val) {
        _class_call_check(this, Node);
        this.prev = this.next = this;
        this.value = val;
    }
    var _proto = Node.prototype;
    _proto.link = function link(next) {
        this.next = next;
        next.prev = this;
        return next;
    };
    return Node;
}();
var LinkedArray = /*#__PURE__*/ function() {
    "use strict";
    function LinkedArray() {
        _class_call_check(this, LinkedArray);
        this.node = null;
        this.length = 0;
    }
    var _proto = LinkedArray.prototype;
    _proto.push = function push(value) {
        var node = new Node(value);
        this.length++;
        if (!this.node) {
            this.node = node;
            return node;
        }
        this.node.prev.link(node);
        node.link(this.node);
        return node;
    };
    _proto.shift = function shift() {
        if (!this.node) throw new Error('Cannot shift: array empty');
        var node = this.node;
        this.length--;
        node.prev.link(node.next);
        if (node === this.node) this.node = node.next === node ? null : node.next;
        return node.link(node).value;
    };
    return LinkedArray;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }