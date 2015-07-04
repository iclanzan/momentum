'use strict';

var emitter = require('eventemitter3').prototype;

var hasListeners = function (animationLoop) {
  return animationLoop.listeners('step', 1);
};

module.exports = function (options) {
  var animationLoop = Object.create(emitter);
  var off = animationLoop.off;
  var running = false;
  var shouldStop = false;
  var lastTime = 0;
  var accumulatedTime = 0;

  var loop = function (currentTime) {
    // console.log('t', currentTime);
    if (shouldStop) {
      running = shouldStop = false;
      return;
    }

    var timeStep = options.timeStep;
    var frameTime = currentTime - lastTime;

    lastTime = currentTime;
    accumulatedTime += frameTime * options.timeScale;
    // console.log('ac', accumulatedTime, frameTime);
    while (accumulatedTime > 0) {
      // console.log('emit');
      animationLoop.emit('step', timeStep);
      accumulatedTime -= timeStep;
    }

    animationLoop.emit('render', 1 + accumulatedTime / timeStep);
    options.ticker(loop);
  };

  animationLoop.start = function () {
    if (hasListeners(animationLoop)) {
      if (shouldStop) {
        shouldStop = false;
      } else if (!running) {
        running = true;
        lastTime = options.getTime();
        options.ticker(loop);
      }
    }

    return animationLoop;
  };

  animationLoop.stop = function () {
    shouldStop = true;

    return animationLoop;
  };

  // animationLoop.isStopped = function () {
  //   return
  // };

  animationLoop.off = function (event, fn, context) {
    off.call(animationLoop, event, fn, context);

    if (running && !hasListeners(animationLoop)) {
      shouldStop = true;
    }

    return animationLoop;
  };

  animationLoop.options = function (newOptions) {
    options = newOptions;

    return animationLoop;
  };

  return animationLoop;
};
