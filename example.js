var fill = require('./');
var Bar = require('colorcoded-bar');
var raf = require('raf');

var data = [];
var lines = 20000;
for (var i = 0; i < lines; i++) data[i] = Math.random();
var delay = 0;

(function(){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var bar = new Bar;

  var status = fill(bar, {
    strategy: 'topdown',
    length: lines
  }, function(i, cb){
    setTimeout(function(){
      cb(null, 'rgba(1, 1, 1, ' + data[i] + ')');
    }, Math.random() * delay);
  });

  (function draw(){
    bar.render({ width: 100, height: 600, canvas: canvas });
    if (status.fetching) raf(draw);
  })();
})();

(function(){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var bar = new Bar;
  var start = new Date;

  var status = fill(bar, {
    strategy: 'refine',
    length: lines
  }, function(i, cb){
    setTimeout(function(){
      cb(null, 'rgba(1, 1, 1, ' + data[i] + ')');
    }, Math.random() * delay);
  });

  (function draw(){
    bar.render({ width: 100, height: 600, canvas: canvas });
    if (status.fetching) raf(draw);
    else console.log((new Date) - start, 'ms');
  })();
})();

