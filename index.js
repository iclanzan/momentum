'use strict';

module.exports = require('./lib/system')({
  integrator: require('./lib/symplecticEulerIntegrator'),
  getTime: performance.now.bind(performance),
  ticker: requestAnimationFrame.bind(window),
  timeStep: 1000 / 60,
  timeScale: 1
});
