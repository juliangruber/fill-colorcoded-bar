
# fill-colorcoded-bar

  Progressively fill a colorcoded bar based on an async data source


## Example

  [![view on requirebin](http://requirebin.com/badge.png)](http://requirebin.com/?gist=5d2096105d5acd69325d)

```js
var fill = require('fill-colorcoded-bar');
var Bar = require('colorcoded-bar');
var raf = require('raf');

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
var bar = new Bar;

var status = fill(bar, {
  strategy: 'topdown',
  length: 1000
}, function(i, cb){
  setTimeout(function(){
    cb(null, 'rgba(1, 1, 1, ' + Math.random() + ')');
  }, Math.random() * 300);
});

(function draw(){
  bar.render({ width: 100, height: 600, canvas: canvas });
  if (status.fetching) raf(draw);
})();
```

## Installation

```bash
$ npm install fill-colorcoded-bar
```

## License

  MIT

