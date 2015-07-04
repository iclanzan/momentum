'use strict';

var partial = require('lodash/function/partial');
var animationLoop = require('./animationLoop');

var springForces = [
  require('./oscillatoryForce').bind(null, 525),
  require('./dampingForce').bind(null, 20)
];

var tolerance = 0.001;

var almostZero = function (value) {
  return value < tolerance && value > -tolerance;
};

module.exports = function (options) {
  var integrator = options.integrator;
  var animation = animationLoop(options);

  var resolver = function (structure, callback, resolve) {
    var prev;

    var step = function (timeDelta) {
      console.log('step');
      prev = structure;
      structure = {
        body: integrator(structure.body, structure.forces, timeDelta / 1000),
        forces: structure.forces
      };
    };

    var render = function (alpha) {
      console.log('render');
      var body = structure.body;
      var interpolatedPosition =
        body.p * alpha + prev.body.p * (1 - alpha);

      callback(interpolatedPosition);

      if (almostZero(body.p) && almostZero(body.v)) {
        animation
          .off('step', step)
          .off('render', render);
        console.log('resolve');
        resolve();
      }
    };

    animation
      .on('step', step)
      .on('render', render);

    animation.start();
  };

  var add = function (structure, callback) {
    return new Promise(partial(resolver, structure, callback));
  };

  return {
    animation: animation,
    add: add,
    spring: function (value, callback) {
      return add(
        {
          body: typeof value == 'number' ? {
            p: value,
            v: 0,
            m: 1
          } : value,
          forces: springForces
        },
        callback
      );
    }
  };
};
