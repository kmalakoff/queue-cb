export default class LinkedArray {
    node: any;
    length: number;
    push(value: any): Node;
    shift(): any;
}
declare class Node {
    constructor(val: any);
    prev: this;
    next: this;
    value: any;
    link(next: any): any;
}
export {};
