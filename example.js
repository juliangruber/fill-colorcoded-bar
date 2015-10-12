var fill = require('./');
var Bar = require('colorcoded-bar');
var raf = require('raf');

var data = [];
for (var i = 0; i < 1000; i++) data[i] = Math.random();
var delay = 1000;

(function(){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var bar = new Bar;

  var status = fill(bar, {
    strategy: 'topdown',
    length: 1000
  }, function(i, cb){
    setTimeout(function(){
      cb(null, 'rgba(1, 1, 1, ' + data[i] + ')');
    }, Math.random() * 300);
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

  var status = fill(bar, {
    strategy: 'refine',
    length: 1000
  }, function(i, cb){
    setTimeout(function(){
      cb(null, 'rgba(1, 1, 1, ' + data[i] + ')');
    }, Math.random() * 300);
  });

  (function draw(){
    bar.render({ width: 100, height: 600, canvas: canvas });
    if (status.fetching) raf(draw);
  })();
})();

/*
(function(){
  var canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  var bar = new Bar;

  var status = fill(bar, {
    strategy: 'refine',
    length: 1000
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
*/
