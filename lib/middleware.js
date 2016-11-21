/*middleware*/
var util = require('./util');
var config = util.setting;
var cache = require('../cache');

var debug = require('debug')('lib:middleware');

exports.debuging = function *(next){
	var ctx = this;
  var message =  this.method + ' ' + this.protocol + '://' + this.host + this.url + ' | ' + this.ip;
  debug('-->', message);
  var start = Date.now();
  yield next;
  var status = this.status;
  var ms = Date.now() - start;
  message = this.method + ' ' + this.protocol + '://' + this.host + this.url + ' ' + status + ' - ' + ms + 'ms / ' + this.ip;
  debug('<--', message);
  ctx.set('X-Response-Time', ms + 'ms');
}

exports.addError = function *(next){
	var ctx = this;
  ctx.addError = function(key, tip){
    if (!ctx.errors) {
      ctx.errors = [];
    }
    var e = {};
    e[key] = tip;
    ctx.errors.push(e);
  };
  yield next;
};

exports.dumpJSON = function *(next){
  var ctx = this;
  ctx.dumpJSON = function(){
    var status = 0;
    var msg;
    var data = null;

    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (arg instanceof Error) {
        err = arg;
        status = err.status || err.statusCode || status;
        continue
      }
      switch (typeof arg) {
        case 'string':
          msg = arg;
          break;
        case 'number':
          status = arg;
          break;
        case 'object':
          data = arg;
          break
      }
    }

    ctx.body = {
      status: status || 0,
      message: msg || 'success',
      data: data || null
    };
  };
  yield next;
};

exports.csrf = function *(next){
	// ignore get, head, options
  // charge notify url & back charge should not assertCSRF
  if (this.method === 'GET'
    || this.method === 'HEAD'
    || this.method === 'OPTIONS'
		|| this.path === '/ueditor/ue') {
    return yield next;
  }

  var body = this.request.body;
  // koa-body fileds. multipart fields in body.fields
	if(this.is('multipart')){
		body =  body.fields || body;
	}

  // bodyparser middlewares maybe store body in request.body
  // or you can just set csrf token header
  this.assertCSRF(body);

  yield next;
};

exports.state = function *(next){
	var ctx = this;
  var session = ctx.session;
  ctx.state = {
    debug: config.debug,
    isLogin: false,
    user: null,
    session: session,
    csrf: ctx.csrf,
    path: ctx.path
  };
  // debug
  if (config.debug) {
    ctx.state._request = ctx.request;
  }
  if ( session.isLogin ) {
    ctx.state.isLogin = true;
    ctx.state.user = session.user;
    //ctx.state.userState = yield ctx.redis.hgetall( util.k_user(session.user.id) );
  }

  // global userState
  yield Promise.all([
    cache.home.get_global(),
    session.isLogin ? cache.user.get_state(session.user.id) : null
  ]).then(function(values){
    ctx.state.global = values[0];
    ctx.state.userState = values[1];
    debug('getUserState:', values[1]);
  }, function(error){
    debug('app.user.state', error)
  });
  debug('app.session', ctx.sessionId, ctx.sessionKey);
  yield next;
};
