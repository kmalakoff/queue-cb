// stripped down version of https://github.com/mafintosh/fifo
class Node {
  prev: this;
  next: this;
  value: unknown;

  constructor(val) {
    this.prev = this.next = this;
    this.value = val;
  }

  link(next) {
    this.next = next;
    next.prev = this;
    return next;
  }
}

export default class LinkedArray {
  node: Node | null;
  length: number;

  constructor() {
    this.node = null;
    this.length = 0;
  }

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
}
