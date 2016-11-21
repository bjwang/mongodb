
if ( window['app'] ) {
  return $.error('app has been loaded!');
}
require('./customValidate');

var app;
var util = require('./util');
var handlerHome = require('./home.js');
var handlerHeartBeat = require('./heartBeat');
var handlerSignup = require('./signup');
var handlerLogin = require('./login');
var handlerAccountPassword = require('./account.password');
var handlerProductDetail = require('./product.detail');
var handlerAdd = require('./add');

// shim for ie
function polyfill(){
  if ( !Date.now ) {
    Date.now = function(){
      return (new Date()).getTime();
    }
  }
}

app = {
	// Make sure that every Ajax request sends the CSRF token
  CSRFProtection: function (xhr) {
    var token = $('meta[name="csrf-token"]').attr('content');
    if (token) xhr.setRequestHeader('X-CSRF-Token', token);
  },
  refreshCSRFTokens: function () {
    //console.log('app.refreshCSRF');
    var csrfToken = $('meta[name=csrf-token]').attr('content');
    var csrfParam = $('meta[name=csrf-param]').attr('content');
    $('form input[name="' + csrfParam + '"]').val(csrfToken);
  },
  attachCSRF: function(){
    //console.log('app.attachCSRF');
    var me = this;
    $.ajaxPrefilter(function (options, originalOptions, xhr) {
      if (!options.crossDomain) {
        me.CSRFProtection(xhr);
      }
    });
    me.refreshCSRFTokens();
    return me;
  },
  home: handlerHome,
  heartBeat: handlerHeartBeat,
  signup: handlerSignup,
  login: handlerLogin,
  accountPassword: handlerAccountPassword,
  productDetail: handlerProductDetail,
  articleAdd: handlerAdd,
  util: util,
  init: function(){
    var me = this;
    polyfill();
    me.attachCSRF();
    me.heartBeat();
    return me;
  }
};

// app init
app.init();

// assgin to window
window['app'] = app;

exports = module.exports = app;
