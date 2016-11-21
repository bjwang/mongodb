'use strict';
// user
var co = require('co');
var cache = require('memory-cache');
var debug = require('debug')('cache:user');
var db = require('../lib/db');
var conf = require('./conf');

var redis = db.redis;

exports.get_state= function(id){
  if ( !id ) {
    return null;
  }
  return co(function *(){
    var key = 'u:'+id;
    var data = yield redis.hgetall(key);
    debug('get_state', key, data);
    //return cache.put(key, data, conf.SHORT);
    return data;
  })
};
