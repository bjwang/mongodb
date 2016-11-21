// limit
var _ = require('lodash');
var ratelimit = require('koa-ratelimit');
var debug = require('debug')('handler:limit');

var redis = require('../lib/db')._redisMaster;

var SECOND = 1000;
var MINUTE = 60 * SECOND;
var HOUR = 60 * MINUTE;
var DAY = 24 * HOUR;

// limit
var limit = function *(next){
};
// ip limit
limit.ipLimit = ratelimit({
  db: redis,
  //duration: 60000,
  duration: HOUR,
  max: 10,
  id: function (ctx) {
    debug('limit.ipLimit', ctx.ip);
    return ctx.ip;
  }
});
// mobile limit
limit.mobileLimit = ratelimit({
  db: redis,
  //duration: 60000,
  duration: DAY,
  max: 2,
  id: function (ctx) {
    var body = _.get(ctx, 'request.body.fields') || _.get(ctx, 'request.body') || {};
    var mobile = _.get(body, 'mobile', '000000');
    debug('limit.mobileLimit', mobile);
    return mobile;
  }
});
// export
module.exports = limit;
