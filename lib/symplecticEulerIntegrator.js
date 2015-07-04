'use strict';

var acceleration = require('./acceleration');

module.exports = function (body, forces, timeDelta) {
  var nextVelocity = body.v + acceleration(body, forces) * timeDelta;

  return {
    v: nextVelocity,
    p: body.p + nextVelocity * timeDelta,
    m: body.m
  };
};
