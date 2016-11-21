/**
* user
*/
var url = require('url');
var _ = require('lodash');

var util = require('../lib/util');
var ErrMsg = require('../lib/errormsg');
var debug = require('debug')('controller:user');

var AJAX_ERROR = util.AJAX_ERROR;
var AJAX_SUCCESS = util.AJAX_SUCCESS;
var HTTP_POST = 'POST';
var HTTP_GET = 'GET';
var DEFAULT_LOGIN = '/account';
var DEFAULT_SINGUP = '/singup/success';
/**
 * get mobile
 */
function getMobile(k){
  var ctx = this;
  if ( !k ) {
    k = 'mobile';
  }
  return ctx.checkBody(k).trim().notEmpty(ErrMsg.isMobile).match(util.reMobile, ErrMsg.isMobile).value;
}
/**
 * get signup form data from req.body
 */
function getSignupData(){
  var ctx = this;
  var data = {
    mobile: getMobile.call(this),
    captcha: ctx.checkBody('captcha').trim().value,
    smscode: ctx.checkBody('smscode').trim().notEmpty(ErrMsg.lenSmsCode).match(util.reSms, ErrMsg.isSmsCode).value,
    password: ctx.checkBody('password').trim().notEmpty(ErrMsg.lenPwd).len(3, 20, ErrMsg.lenPwd).value,
    utmSource: ctx.checkBody('utmSource').trim().value,
    ipAddress: ctx.ip
  };
  data.mobileNumber = data.mobile;
  console.log(data);
  return data;
}
/**
 * get forgot data
 */
function getForgotData(){
  var ctx = this;
  var data = {
    mobile: getMobile.call(this),
    smscode: ctx.checkBody('smscode').trim().notEmpty(ErrMsg.lenSmsCode).match(util.reSms, ErrMsg.isSmsCode).value,
    password: ctx.checkBody('newpassword').trim().notEmpty(ErrMsg.lenNewPwd).len(3, 20, ErrMsg.lenNewPwd).value,
    repassword: ctx.checkBody('repassword').trim().value,
    ipAddress: ctx.ip
  };
  data.mobileNumber = data.mobile;
  return data;
}
/**
 * get login form data from req.body
 */
function getLoginData(){
  var ctx = this;
  var data = {
    mobile: getMobile.call(this),
    password: ctx.checkBody('password').trim().notEmpty(ErrMsg.login).len(3, 50, ErrMsg.login).value,
    ipAddress: ctx.ip
  };
  data.mobileNumber = data.mobile;
  return data;
}

var user = function *(next){
	yield next;
};

user.login = function *(){
	var ctx = this;
  var reUrl = ctx.get('Referer');
  var WEB_HOST = ctx.hostname;
  var originaUrl = ctx.protocol;
  var nextUrl = ctx.session.nextUrl;
  if(nextUrl){
    ctx.session.loginUrl = nextUrl;
  }else if(reUrl){
    var refereUrl = url.parse(reUrl).pathname;
    var _host = url.parse(reUrl).hostname;
    debug('login get refere', refereUrl, reUrl, _host);
    if(_host === WEB_HOST){
      if(refereUrl === '/' || refereUrl === '/signup' || refereUrl === '/login'){
        ctx.session.loginUrl = DEFAULT_LOGIN;
      }else{
        ctx.session.loginUrl = refereUrl;
      }
    }else if(_host === BBS_HOST){
      ctx.session.loginUrl = reUrl;
    }else{
      ctx.session.loginUrl = DEFAULT_LOGIN;
    }
  }else{
    ctx.session.loginUrl = DEFAULT_LOGIN;
  }

	ctx.render('login.pug');
};
// login required
user.loginRequired = function *(next){
  var ctx = this;
  var isLogin = ctx.state.isLogin;
  debug('user.loginRequired', isLogin);
  if ( !isLogin ) {
    // login jump back
    if(ctx.session.loginUrl){
      ctx.session.loginUrl = ctx.url;
    }else{
      ctx.session.nextUrl = ctx.url;
    }
    debug('ctx.session.loginUrl+nextUrl: ', ctx.session.loginUrl, ctx.session.nextUrl);
    ctx.redirect('/login');
    return ;
  }
  yield next;
};
user.loginCheck = function *(next){
	var ctx = this;
  var isLogin = ctx.state.isLogin;
  debug('user.loginCheck', isLogin, ctx.session);
  if ( isLogin ) {
    ctx.redirect('/');
    return ;
  }
  yield next;
};

user.loginPost = function *(){
	var ctx = this;
  var _count = ctx.session.log = ctx.session.log || 0;
  var _security = 'security';
  var _now = util.now();
  var data;
  var logcount = 3; // gt logcount will logging
  var securitycount = 20; // gt securitycount will refuse login
  var nextUrl;
  var _ipcount = 0;
  var _mobilecount = 0;
  var _duration = 43200; // sec; 12 hour 60*60*12
  var _ipkey;
  var _mobilekey;
  var _render = function(){
    ctx.state.errors = ctx.errors;
    ctx.render('login.pug');
  };
  var _key = function(id, prefix){
    prefix = prefix ? prefix : 'ip';
    return [_security, prefix, id].join(':');
  };
  var _updateSecurity = function (){
    return function *(){
      return Promise.all([
        ctx.redisMaster.multi()
          .set([_ipkey, _ipcount, 'EX', _duration, 'NX'])
          .set([_mobilekey, _mobilecount, 'EX', _duration, 'NX'])
          .exec()
      ]);
    };
  };

  data = getLoginData.apply(this);
  _ipkey = _key(data.ipAddress, 'ip');
  _mobilekey = _key(data.mobileNumber, 'mobile');

  // login try 3 times log it
  if ( _count > logcount ) {
    console.log(ctx.ip, 'user.login.count', data.password, _count, ctx.sessionId);
  }

  ctx.state.query = data;

  // validate
  if ( ctx.errors ){
    _render();
    return;
  }

  // security count check with ip/mobile
  yield ctx.redisMaster.mget(_ipkey, _mobilekey)
    .then(function(value){
      _ipcount = value[0] - 0 || 0;
      _mobilecount = value[1] - 0 || 0;
    });
  if ( _ipcount > logcount ) {
    console.log(ctx.ip, 'user.login.ipcount', data.password, _ipcount, ctx.sessionId);
  }
  if ( _mobilecount > logcount ) {
    console.log(ctx.ip, 'user.login.mobilecount', data.password, _mobilecount, ctx.sessionId);
  }
  if ( _ipcount >= securitycount || _mobilecount >= securitycount ) {
    ctx.addError('page', ErrMsg.loginCount);
    return;
  }

  // validate with redis
  var _usermobile = data.mobile;
  var _user = yield ctx.redis.hgetall( util.k_mobile( _usermobile ) );
  if ( !_user || !util.bcompare(data.password, _user.password) ) {
    ctx.addError('page', ErrMsg.login);
  }
  ctx.session.log = ctx.session.log + 1;
  debug('user.loginPost.data', data, _user);

  if ( ctx.errors ){
    // security count check
    _ipcount++;
    _mobilecount++;
    yield _updateSecurity();
    _render();
    return;
  }
  // bcrypt.hash password
  //_.extend(data, {
  //  password: util.bhash(data.password)
  //});
  debug('user.loginPost.log', _usermobile);
  // send login log to api
  yield ctx.proxy.login( data )
    .then(function(value){
      debug('user.loginPost.proxy.response', value);
      var ret = JSON.parse(value);
      ctx.session.qualified = _.get(ret, 'data.qualified') || false
    }, function(error){
      debug('user.loginPost.proxy.error', error);
    });
  ctx.session.isLogin = true;
  ctx.session.user = {
    id: _user.userId || _user.userid,
    mobile: data.mobile,
    time: Date.now()
  };
  debug('ctx.session.loginUrl:', ctx.session.loginUrl);
  if(ctx.session.loginUrl){
    nextUrl = ctx.session.loginUrl;
  }else{
    nextUrl = ctx.session.nextUrl;
  }

  if ( ctx.session.loginUrl ) {
    delete ctx.session.loginUrl;
  }
  if ( ctx.session.nextUrl ) {
    delete ctx.session.nextUrl;
  }
  // save logcount in session even login success
  //delete ctx.session.log;
  ctx.session.regModal = 1;
  ctx.state.nextUrl = nextUrl;
  ctx.redirect(nextUrl);
};
// logout
user.logout = function *(){
  var ctx = this;
  var data = {};
  ctx.session.isLogin = false;
  ctx.session.user = null;
  //ctx.session.nextUrl = null;
  if(ctx.session.loginUrl){
    delete ctx.session.loginUrl;
  }
  if(ctx.session.nextUrl){
    delete ctx.session.nextUrl;
  }
  ctx.state.nextUrl = '/';
  delete ctx.session.qualified;
  ctx.redirect('/');
};
// captcha
user.captcha = function *(){
  var ctx = this;
  debug('user.captcha::');
  yield ctx.proxy.getCaptcha({ipAddress: ctx.ip})
    .then(function(value){
      debug('user.captcha', value);
      var ret = JSON.parse(value);
      if ( ret.status !== 0 ) {
        ctx.throw(502);
        return;
      }
      var captcha = _.get(ret, 'data.captchaImg');
      var word = _.get(ret, 'data.captchaWord');
      if ( !word || !captcha ) {
        ctx.throw(502);
      }
      ctx.session.captcha = word.toLowerCase();
      ctx.session.captchacount = 0;
      ctx.type = 'image/png';
      ctx.body = new Buffer(captcha, 'base64');
    }, function(){
      ctx.throw(503);
    });
};
/**
 * check mobile
 */
user.checkMobile = function *(){
  var ctx = this;
  var fail = false;
  var success = true;
  var data = {
    mobile: getMobile.call(this)
  };
  debug('check.mobile', data);
  if ( ctx.errors ) {
    ctx.body = fail;
    return;
  }
  if ( yield ctx.redis.exists(util.k_mobile(data.mobile)) ) {
    ctx.body = fail;
    return;
  }
  ctx.body = success;
};
user.checkExistMobile = function *(){
  var ctx = this;
  var fail = false;
  var success = true;
  var data = {
    mobile: getMobile.call(this)
  };
  debug('checkExistMobile', data);
  if ( ctx.errors ) {
    ctx.body = fail;
    return;
  }
  if ( yield ctx.redis.exists(util.k_mobile(data.mobile)) ) {
    ctx.body = success;
    return;
  }
  ctx.body = fail;
};
/**
 * send Verify Code
 */
user.sendVerifyCode = function *(next){
  var ctx = this;
  var userid = ~~_.get(ctx.state, 'user.id') || 0;
  var err = _.clone(AJAX_ERROR);
  var success = _.clone(AJAX_SUCCESS);
  var errMsg = 'send verify code error';
  var isLogin = ctx.state.isLogin;
  var action = ctx.checkBody('action').value;
  var data;
  var last = _.get(ctx.session, 'lastsms', 0) - 0;
  var interval = 60 * 1000; // 60sec
  var usermobile = _.get(ctx.state, 'user.mobile', null);
  if ( !action || action.length < 3 ) {
    ctx.body = err;
    return;
  }
  // just singup need verifyCode
  // not singup clean error
  if ( action && action.length && action !== 'signup') {
    ctx.errors = null;
  }
  // echo verifyCode error
  if ( ctx.errors ) {
    ctx.body = err;
    return;
  }
  // check time interval
  if ( (Date.now() - last) < interval ) {
    err.message = ErrMsg.quickSmsCode;
    ctx.body = err;
    return;
  }

  //action : singup, forgot, paypass, bind/check
  if ( isLogin && ( action === 'paypass' || action === 'check' ) ) {
    // 修改密码等
    data = {
      mobileNumber: usermobile,
      userId: userid,
      ipAddress: ctx.ip
    };
  }else{
    // sinup, forgot, bind
    data = {
      mobileNumber: getMobile.apply(this),
      userId: userid,
      ipAddress: ctx.ip
    };
    // checkt mobile exist
    yield ctx.redis.exists(util.k_mobile(data.mobileNumber))
      .then(function(value){
        debug('sendVerifyCode.redis.exists', util.k_mobile(data.mobileNumber), value);
        var isExist = ~~value || 0;
        if (action === 'forgot') {
          // forgot should exists
          if (!isExist) {
            ctx.addError('mobile', err.message = ErrMsg.mobileNotExists);
          }
        } else {
          // sinup,bind should not exists
          if (isExist) {
            ctx.addError('mobile', err.message = ErrMsg.mobileExists);
          }
        }
      }, function(error){
        debug('sendVerifyCode.redis.exists.error', error);
        ctx.addError('mobile', err.message = ErrMsg.def);
      });
  }

  // validate err
  if ( ctx.errors ) {
    ctx.body = err;
    return;
  }

  // log verifyCode
  console.log('[verifyCode]', ctx.ip, data.mobileNumber);

  debug('user.sendVerifyCode', data);

  ctx.session.lastsms = Date.now();
  // TODO: check mobile not blacklist
  yield ctx.proxy.sendValidateCode( data )
    .then(function(value){
      var ret = JSON.parse(value);
      debug('user.sendVerifyCode.response', ret);
      if ( ret.status !== 0 ) {
        err.message = ret.message || errMsg;
        ctx.addError('page', err.message);
        return;
      }
    }, function(error){
      debug('user.VerifyCode.error', error);
      ctx.addError('page', errMsg);
    });
  // backend err
  if ( ctx.errors ) {
    err.message = errMsg;
    ctx.body = err;
    return;
  }
  ctx.body = success;
  //_render();
};
// verify captcha
user.verifyCaptcha = function *(next){
  var ctx = this;
  var disabledCaptcha = ~~_.get(ctx.state, 'global.disabledcaptcha') || 0;
  debug('user.verifyCaptcha:', disabledCaptcha);
  if ( disabledCaptcha ) {
    return yield next;
  }
  ctx.session.captchacount = ctx.session.captchacount || 1;
  ctx.session.captchacount++;
  var code = _.get(ctx.session, 'captcha', '100000');
  var captcha = ctx.checkBody('captcha').trim().notEmpty(ErrMsg.lenCaptcha).value.toLowerCase();
  var count = ctx.session.captchacount;
  debug('user.verifyCaptcha.captcha:', captcha, code, count);
  if (count > 10) {
    ctx.addError('captcha', ErrMsg.expireCaptcha);
    return yield next;
  }
  if ( ctx.errors || code !== captcha ) {
    debug('user.verifyCaptcha.fail');
    ctx.addError('captcha', ErrMsg.isCaptcha);
    return yield next;
  }
  yield next;
};
// check captcha for input
user.checkCaptcha = function *(){
  var ctx = this;
  var fail = false;
  var success = true;
  if ( ctx.errors ) {
    debug('ctx.errors.checkCaptcha', ctx.errors);
    ctx.body = fail;
    return;
  }
  ctx.body = success;
};
// 忘记密码重置
user.forgot = function *(){
  var ctx = this;
  var method = ctx.method;
  var errMsg = ErrMsg.def;
  var data;
  var _render = function(){
    ctx.state.query = data;
    ctx.state.errors = ctx.errors;
    ctx.render('user.forgot.pug');
  };
  if ( method === HTTP_POST ) {
    data = getForgotData.call(this);
    if ( data.repassword !== data.password ) {
      ctx.addError('repassword', ErrMsg.rePwd);
    }
    if ( ctx.errors ){
      _render();
      return;
    }
    // validate smscode
    if ( data.smscode ) {
      //usermobile
      var _mobile = data.mobile;
      var _smsCode = yield ctx.redis.get(util.k_verify(_mobile));
      debug('user.forgot.checkSmsCode', _smsCode, '/', data.smscode);
      if ( !_smsCode || ( _smsCode !== data.smscode ) ) {
        ctx.addError('smscode', ErrMsg.isSmsCode);
      }
      // invalid smscode
      if ( _smsCode && data.smscode && _smsCode === data.smscode ) {
        debug('user.forgot.invalidSmsCode', _mobile, ':', data.smscode);
        //util.invalidVerify.call(ctx, _mobile);
        yield ctx.proxy.deleteValidateCode({
          mobileNumber: data.mobileNumber,
          validationCode: data.smscode,
          ipAddress: data.ipAddress
        });
      }
    }
    // validate result
    if ( ctx.errors ){
      _render();
      return;
    }
    // enctypt password
    _.extend(data, {
      //oldPassword: util.bhash(data.oldPassword),
      password: util.bhash(data.password)
    });
    debug('user.forgot', data);
    // post to API
    yield ctx.proxy.resetPassword( data )
      .then(function(value){
        debug('user.forgot.response', value);
        var ret = JSON.parse(value);
        if (ret.status !== 0) {
          ctx.addError('page', ret.message || errMsg);
          return;
        }
        // success
        _.extend(ctx.state, {
          result: 'success'
        });
      }, function(error){
        // network error
        debug('user.forgot.proxy', error);
        ctx.addError('page', errMsg);
      });
    // set end
    _render();
    return;
  }

  _render();
};
// signup post
user.signupPost = function *(){
  var ctx = this;
  var errMsg = ErrMsg.def;
  var _user;
  var data;
  var _render = function(){
    ctx.state.query = data;
    ctx.state.errors = ctx.errors;
    ctx.render('user.signup.pug');
  };

  data = getSignupData.apply(this);

  debug('sign up data', data);
  // validate err
  if ( ctx.errors ){
    _render();
    return;
  }
  // check username & mobile available from redis
  var bValid = true;
  debug('checkMobileNumber:', data.mobile);
  yield ctx.redis.exists(util.k_mobile(data.mobile))
    .then(function(value){
      if ( value ) {
        bValid = bValid && false;
        ctx.addError('mobile', ErrMsg.mobileExists);
      }else{
        // key not exist can by used
      }
    }, function(err){
      debug('signupPost.checkMobileNumber', err);
      ctx.addError('mobile', ErrMsg.mobileExists);
    });
  /*
   if ( yield ctx.redis.exists(util.k_mobile(data.mobile)) ) {
   bValid = bValid && false;
   ctx.addError('mobile', ErrMsg.mobileExists);
   }
   */
  if ( !bValid ) {
    _render();
    return;
  }
  var _smsCode = yield ctx.redis.get(util.k_verify(data.mobile));
  debug('checkSmsCode', _smsCode, '/', data.smscode);
  if ( !_smsCode || ( _smsCode !== data.smscode ) ) {
    bValid = bValid && false;
    ctx.addError('smscode', ErrMsg.isSmsCode);
  }
  if ( _smsCode && data.smscode && _smsCode === data.smscode ) {
    debug('invalid SmsCode', data.mobile, ':', data.smscode);
    // invalid smscode
    //util.invalidVerify.call(ctx, data.mobile);
    yield ctx.proxy.deleteValidateCode({
      mobileNumber: data.mobileNumber,
      validationCode: data.smscode,
      ipAddress: data.ipAddress
    });
  }
  if ( !bValid ) {
    _render();
    return;
  }
  // bcrypt.hash password
  _.extend(data, {
    password: util.bhash(data.password),
    refererId: ctx.session.refererId || 0
  });
  debug('sign up success data', data);
  // post to API
  yield ctx.proxy.signup(data)
    .then(function(value){
      debug('user.sinup.response', value);
      var ret = JSON.parse(value);
      if ( ret.status !== 0 ) {
        ctx.addError('page', ret.message || errMsg);
        return;
      }
      _user = ret.data;
      _.extend(ctx.session, {
        isLogin: true,
        user: {
          id: _user.id,
          mobile: _user.mobile,
          time: Date.now()
        }
      });
      //ctx.redirect(SINGUP_STEP_1);
    }, function(err){
      debug('user.signup.error', err);
      ctx.addError('page', errMsg);
      return;
    });
  ctx.session.regModal = 1;
  // render on error
  if( ctx.errors ){
    _render();
    return;
  }
  ctx.redirect(DEFAULT_SINGUP);
};
user.signup = function *(){
  var ctx = this;

  ctx.render('user.signup.pug');
};
user.result = function *(){
  var ctx = this;

  ctx.render('user.signup.result.pug');
};
user.investConfirm = function *(){
  var ctx = this;
  var msg = msg || ErrMsg.def;
  var _userId = _.get(ctx.state, 'user.id', 0) - 0;
  if(ctx.error){
    ctx.dumpJSON(403, msg)
  }
  debug('user.qualified.userid', _userId);
  yield ctx.proxy.userQualified({userId: _userId})
    .then(function(value){
      debug('user.qualified.confirm::', value);
      var ret = JSON.parse(value);
      if(ret.status !== 0){
        ctx.dumpJSON(403, msg)
      }
      ctx.session.qualified = true;
      ctx.dumpJSON();
    }, function(error){
      ctx.dumpJSON(500, msg);
      debug('user.investConfirm.error', error);
    });
};

user.qualified = function *(next){
  var ctx = this;
  ctx.state.qualified = true;
  return yield next;
};

module.exports = user;
