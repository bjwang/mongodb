'use strict';
// cache
var cache = require('memory-cache');

var conf = require('../config');

exports.home = require('./home');
exports.user = require('./user');

// cache debug
//cache.debug(conf.debug || false);

Object.keys(cache).forEach( function(key) {
  exports[key] = cache[key];
});

