'use strict';
// home
var co = require('co');
var cache = require('memory-cache');
var debug = require('debug')('cache:home');
var proxy = require('../lib/proxy');
var db = require('../lib/db');
var conf = require('./conf');

var redis = db.redis;

// global
exports.get_global = function(){
  return co(function *(){
    var key = 'global';
    var data = cache.get(key);
    if ( data ) {
      return data;
    }
    data = yield redis.hgetall(key);
    //debug('get_global', key, data);
    return cache.put(key, data, conf.LONG);
  })
};

// banner list
exports.get_banner_list = function(){
  return co(function *(){
    var key = 'banner';
    var data = cache.get(key);
    if ( data ) {
      return data;
    }
    data = yield redis.lrange(key, 0, -1);
    //debug('get_banner_list', key, data);
    return cache.put(key, data.map(JSON.parse), conf.LONG);
  })
};

// product list
exports.get_list_product = function(){
  return co(function *(){
    var key = 'home:product:list';
    var data = cache.get(key);
    if ( data ) {
      return data;
    }
    data = yield proxy.productList();
    var ret = JSON.parse(data);
    debug('cache.home.product.list', ret);
    if ( ret && ret.status === 0 ) {
      return cache.put(key, ret, conf.SHORT);
    }
    throw new Error(503);
  })
};
