var parallel = require('run-parallel');
var EventEmitter = require('events').EventEmitter;
var refinementIterator = require('partition-refinement-iterator');

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
        status.fetching = false;
        status.emit('done');
      }
    });
  })();

  return status;
}

var iterators = {};

iterators.refine = function(length){
  return refinementIterator(length);
};

iterators.topdown = function(length){
  var i = 0;
  if (typeof length == 'undefined') length = Infinity;

  return function(){
    if (i == length) return;
    return i++;
  };
};

