// stripped down version of https://github.com/mafintosh/fifo
class Node<T> {
  prev: Node<T>;
  next: Node<T>;
  value: T;

  constructor(value: T) {
    this.prev = this.next = this;
    this.value = value;
  }

  link(next: Node<T>): Node<T> {
    this.next = next;
    next.prev = this;
    return next;
  }
}

export default class LinkedArray<T> {
  node: Node<T> | null;
  length: number;

  constructor() {
    this.node = null;
    this.length = 0;
  }

  push(value: T): Node<T> {
    const node = new Node<T>(value);
    this.length++;
    if (!this.node) {
      this.node = node;
      return node;
    }
    this.node.prev.link(node);
    node.link(this.node);
    return node;
  }

  shift(): T | null {
    if (!this.node) throw new Error('Cannot shift: array empty');
    const node = this.node;
    this.length--;
    node.prev.link(node.next);
    if (node === this.node) this.node = node.next === node ? null : node.next;
    return node.link(node).value;
  }
}
