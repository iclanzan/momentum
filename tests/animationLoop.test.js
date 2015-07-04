'use strict';

var test = require('tape');
var animationLoop = require('../lib/animationLoop');
var noop = function () {
};
var almostZero = function (value) {
  return value < 0.000001 && value > -0.000001;
};
var resultFromArray = function (array) {
  var index = -1;

  return function () {
    index++;

    if (index >= array.length) {
      throw new Error('Exhausted array.');
    }

    var value = array[index];

    return typeof value == 'function' ? value.apply(this, arguments) : value;
  };
};

test('Animation loop', function (assert) {
  assert.plan(6);

  var timeline = [
    {
      time: 1015,
      step: function (timeStep) {
        assert.equal(
          timeStep, 1000 / 60,
          'calls step function if there is any accumulated time'
        );
      },
      render: function (alpha) {
        assert.equal(
          alpha, 15 / (1000 / 60),
          'calls render function with an alpha value indicating ' +
          'proximity to the next full step.'
        );
      }
    },
    {
      time: 1017,
      step: function (timeStep) {
        assert.equal(
          timeStep, 1000 / 60,
          'always calls step function with the default time step of ' +
          '1000 / 60 as argument.'
        );
      },
      render: function (alpha) {
        assert.ok(
          almostZero(alpha - (17 % (1000 / 60)) / (1000 / 60)),
          'calls render with updated alpha value.'
        );
      }
    },
    {
      time: 1032,
      step: function () {
        assert.fail(
          'does not call step function if accumulated time ' +
          'is less than 0.'
        );
      },
      render: noop
    },
    {
      time: 1051,
      step: function (timeStep) {
        assert.equal(
          timeStep, 1000 / 60,
          'calls step even after a longer frame.'
        );

        timeline[3].step = function () {
          assert.pass(
            'calls step twice after a longer frame.'
          );
        };
      },
      render: noop
    },
    {
      time: 1069
    }
  ];

  var frameIndex = 0;
  var currentFrame;

  var loop = animationLoop({
    getTime: function () {
      // This should become the start time of the animation.
      return 1000;
    },
    ticker: function (callback) {
      if (frameIndex >= timeline.length) {
        assert.fail(
          'does not call ticker after all step listeners are removed.'
        );
      }

      currentFrame = timeline[frameIndex];
      frameIndex++;
      callback(currentFrame.time);
    },
    timeStep: 1000 / 60,
    timeScale: 1
  });

  var step = function (timeStep) {
    currentFrame.step(timeStep);
  };

  var render = function (alpha) {
    currentFrame.render(alpha);
    if (frameIndex >= timeline.length - 1) {
      loop
        .off('step', step)
        .off('render', render);
    }
  };

  loop
    .on('step', step)
    .on('render', render)
    .start();
});

test('Animation loop with no listeners', function (assert) {
  assert.plan(1);

  var loop = animationLoop({
    getTime: function () {
      return 0;
    },
    ticker: function () {
      assert.fail('should not call ticker.');
    },
    timeStep: 1000 / 60,
    timeScale: 1
  });

  loop.start();

  assert.pass('Is a noop.');
});

test('Animation loop stopping and starting', function (assert) {
  assert.plan(1);

  var loop = animationLoop({
    getTime: resultFromArray([0, 20]),
    ticker: resultFromArray([
      function (callback) {
        callback(17);
      },
      function (callback) {
        callback(34);
      },
      function (callback) {
        assert.pass('calls ticker.');
        callback(51);
      },
      function () {
        assert.fail('should not schedule ticker if one is already running.');
      }
    ]),
    timeStep: 1000 / 60,
    timeScale: 1
  });

  loop.on('step', noop);
  loop.on('render', resultFromArray([
    function () {
      loop.off('step', noop);
      loop.on('step', noop);
      loop.start();
    },
    function () {
      loop.off('step', noop);
    }
  ]));
  loop.start();
});
