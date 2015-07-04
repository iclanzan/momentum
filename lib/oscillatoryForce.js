'use strict';

module.exports = function (stiffness, body) {
  return -stiffness * body.p;
};
