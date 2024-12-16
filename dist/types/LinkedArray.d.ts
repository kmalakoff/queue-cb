declare class Node {
    prev: this;
    next: this;
    value: unknown;
    constructor(val: any);
    link(next: any): any;
}
export default class LinkedArray {
    node: Node | null;
    length: number;
    constructor();
    push(value: any): Node;
    shift(): any;
}
export {};
