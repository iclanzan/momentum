'use strict';

function createElement(x, y, size) {
  var element = document.createElement('div');
  var style = element.style;

  size = (size || 20) + 'px';

  style.position = 'absolute';
  style.top = y + 'px';
  style.left = x + 'px';
  style.width = size;
  style.height = size;
  style.borderRadius = size;
  style.backgroundColor = 'black';

  document.body.appendChild(element);

  return element;
}

function translate(element, x, y, z) {
  element.style.transform = 'translate3d(' +
    x + 'px,' + y + 'px,' + z + 'px)';
}

var momentum = require('./');

var ball1 = createElement(50, 150);

console.time('ball1');
setTimeout(function () {
  momentum.spring(200, function (value) {
    translate(ball1, 200 - value, 0, 0);
  })
    .then(momentum.spring.bind(null, 100, function (value) {
      translate(ball1, 200, -100 + value, 0);
    }))
    .then(momentum.spring.bind(null, 100, function (value) {
      translate(ball1, 200, -value, 0);
    })).then(function () {
      console.timeEnd('ball1');
    });
}, 500);
