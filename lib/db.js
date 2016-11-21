// db
var redis = require('redis');
var coRedis = require('co-redis');

var util = require('./util');
var proxy = require('./proxy');

var config = util.setting;
var redisSlaveOpt = config.redis;
var redisMasterOpt = config.redisMaster;

// redisSlave for read
var redisSlave = redis.createClient(
  redisSlaveOpt.port,
  redisSlaveOpt.host,
  redisSlaveOpt.options);
// swtich db
redisSlave.select(redisSlaveOpt.db);

// redisMaster for write (session other)
var redisMaster = redis.createClient(
  redisMasterOpt.port,
  redisMasterOpt.host,
  redisMasterOpt.options);
// swtich db
redisMaster.select(redisMasterOpt.db);

db.proxy = proxy;
db._redisMaster = redisMaster;
db._redisSlave = redisSlave;

db.redisMaster = coRedis(redisMaster);
db.redisSlave = db.redis = coRedis(redisSlave);

//console.log('db init');

// export
module.exports = db;

function db(){
  return function *(next){
    var ctx = this;
    // proxy
    ctx.proxy = proxy;
    // redis read
    // origin
    ctx._redis = ctx._redisSlave = db._redisSlave;
    // co-redis
    ctx.redis = ctx.redisSlave = db.redisSlave;
    // redis write
    // origin redis
    ctx._redisMaster = db._redisMaster;
    // co-redis
    ctx.redisMaster = db.redisMaster;
    yield next;
  };
}
