var nextTick = require('next-tick');

if (typeof process !== 'undefined' && typeof process.versions !== 'undefined' && typeof process.versions.node === 'string') {
  var parts = process.versions.node.split('.');
  if (parts[0] === '0' && parts[1] === '10' && typeof setImmediate === 'function') nextTick = setImmediate;
}

module.exports = nextTick;
