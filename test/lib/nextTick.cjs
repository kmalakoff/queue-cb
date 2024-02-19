let nextTick = require('next-tick');

const major = +process.versions.node.split('.')[0];
const minor = +process.versions.node.split('.')[1];

// patch node 0.10 where process.nextTick was new and non-recursive
if (major === 0 && minor === 10) {
  nextTick = (fn) => setTimeout(fn, 0);
}

module.exports = nextTick;
