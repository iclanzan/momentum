# Momentum

```js
var momentum = require('momentum');
var render = require('momentum/render');

momentum.spring(300, function frame(value) {
  render.translateX(node, value);
}, function done() {
  console.log('Yey!');
});
```
