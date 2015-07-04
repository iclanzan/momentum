'use strict';

var test = require('tape');
var integrate = require('../lib/symplecticEulerIntegrator');

test('Symplectic Euler Integrator', function (assert) {
  assert.plan(1);

  var nextState = integrate(
    {
      v: 100,
      p: 40,
      m: 2
    },
    [
      function () {
        return 42;
      },
      function () {
        return 1;
      }
    ],
    20
  );

  assert.deepEqual(
    nextState,
    {
      v: 100 + (42 + 1) / 2 * 20,
      p: 40 + (100 + (42 + 1) / 2 * 20) * 20,
      m: 2
    },
    'correctly integrates next position and velocity.'
  );
});
