'use strict';

module.exports = function (body, forces) {
  var force = 0;
  var index = 0;

  while (index < forces.length) {
    force += forces[index](body);
    index++;
  }

  return force / body.m;
};
