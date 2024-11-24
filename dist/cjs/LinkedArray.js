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
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var Node = /*#__PURE__*/ function() {
    "use strict";
    function Node(val) {
        _class_call_check(this, Node);
        this.prev = this.next = this;
        this.value = val;
    }
    _create_class(Node, [
        {
            key: "link",
            value: function link(next) {
                this.next = next;
                next.prev = this;
                return next;
            }
        }
    ]);
    return Node;
}();
var LinkedArray = /*#__PURE__*/ function() {
    "use strict";
    function LinkedArray() {
        _class_call_check(this, LinkedArray);
        this.node = null;
        this.length = 0;
    }
    _create_class(LinkedArray, [
        {
            key: "push",
            value: function push(value) {
                var node = new Node(value);
                this.length++;
                if (!this.node) {
                    this.node = node;
                    return node;
                }
                this.node.prev.link(node);
                node.link(this.node);
                return node;
            }
        },
        {
            key: "shift",
            value: function shift() {
                if (!this.node) throw new Error('Cannot shift: array empty');
                var node = this.node;
                this.length--;
                node.prev.link(node.next);
                if (node === this.node) this.node = node.next === node ? null : node.next;
                return node.link(node).value;
            }
        }
    ]);
    return LinkedArray;
}();
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }