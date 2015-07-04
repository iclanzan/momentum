'use strict';

var test = require('tape');
var acceleration = require('../lib/acceleration');

test('Acceleration', function (assert) {
  assert.plan(1);

  var a = acceleration(
    {m: 2},
    [
      function () {
        return 41;
      },
      function () {
        return 11;
      }
    ]
  );

  assert.equal(a, 26, 'adds forces and divides by mass');
});
