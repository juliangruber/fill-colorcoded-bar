var parallel = require('run-parallel');
var EventEmitter = require('events').EventEmitter;

module.exports = function(bar, opts, fetch){
  if (typeof opts == 'function') {
    fetch = opts;
    opts = {};
  }

  var status = new EventEmitter;
  status.fetching = true;
  var fetching = true;

  var length = opts.length;
  var iterate = iterators[opts.strategy || 'topdown'](length);
  var concurrency = opts.concurrency || 10;

  if (typeof length != 'undefined') bar.set(length, '');

  (function next(){
    var fns = [];
    for (var j = 0; j < concurrency; j++) {
      fns.push(function(cb){
        var i = iterate();
        if (typeof i == 'undefined') {
          fetching = false;
          return cb();
        }

        fetch(i, function(err, value){
          if (err) return cb(err);
          bar.set(i, value);
          cb();
        });
      });
    }
    parallel(fns, function(err){
      if (err) return status.emit('error', err);
      if (fetching) {
        next();
      } else {
        console.log('done');
        status.fetching = false;
        status.emit('done');
      }
    });
  })();

  return status;
}

var iterators = {};

iterators.refine = function(length){
  if (typeof length == 'undefined') {
    throw new Error('refine strategy requires .length');
  }
  var next = [];
  var emitted = [];
  var divisor = 2;
  var done = false;

  return function(){
    if (!next.length && !done) {
      var seg = length / divisor;
      for (var i = 0; i < divisor; i++) {
        var val = Math.floor(seg * i);
        if (emitted.indexOf(val) > -1) continue;
        next.push(val);
        emitted.push(val);
      }
      if (divisor >= length && seg < 1) done = true;
      else divisor *= 2;
    }

    var i = next.shift();
    return i;
  };
};

iterators.topdown = function(length){
  var i = 0;
  if (typeof length == 'undefined') length = Infinity;

  return function(){
    if (i == length) return;
    return i++;
  };
};

