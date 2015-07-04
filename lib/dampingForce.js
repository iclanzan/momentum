'use strict';

module.exports = function (damping, body) {
  return -damping * body.v;
};
