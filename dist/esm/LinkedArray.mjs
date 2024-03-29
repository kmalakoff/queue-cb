// stripped down version of https://github.com/mafintosh/fifo
let Node = class Node {
    link(next) {
        this.next = next;
        next.prev = this;
        return next;
    }
    constructor(val){
        this.prev = this.next = this;
        this.value = val;
    }
};
let LinkedArray = class LinkedArray {
    push(value) {
        const node = new Node(value);
        this.length++;
        if (!this.node) {
            this.node = node;
            return node;
        }
        this.node.prev.link(node);
        node.link(this.node);
        return node;
    }
    shift() {
        if (!this.node) throw new Error('Cannot shift: array empty');
        const node = this.node;
        this.length--;
        node.prev.link(node.next);
        if (node === this.node) this.node = node.next === node ? null : node.next;
        return node.link(node).value;
    }
    constructor(){
        this.node = null;
        this.length = 0;
    }
};
export { LinkedArray as default };
