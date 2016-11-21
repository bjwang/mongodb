/**
 * handler login
 */
var util = require('./util');
var ErrMsg = util.ErrMsg;
var Form = util.Form;

var $el = {};
var defaultOption = {
  form: '#J_login-form',
  mobile: '#J_mobile',
  pwd: '#J_password',
  tip: '#J_login-error'
};
var option;

function updateTip(el, str){
  $el.tip.text(str);
  el.focus();
}

function bindForm(form){
  if ( !!form._bindForm ) {
    return;
  }
  form.on('submit', function(e){
    var el = $el.mobile;
    if(el.val().length == 0){
      updateTip(el, ErrMsg.emptyMobile);
      return false;
    }
    if(!util.reMobile.test(el.val())){
      updateTip(el, ErrMsg.isMobile);
      return false;
    }
    el = $el.pwd;
    if(el.val().length < 2){
      updateTip(el, ErrMsg.isPwd);
      return false;
    }
  }).on('input','input', function(e){
    $el.tip.empty();
  });
  form._bindForm = true;
}


var login = {
  init: function(opt){
    var me = this;
    if ( !!me._init ) {
      return me;
    }
    option = $.extend({}, defaultOption, opt);
    $.each(['form', 'mobile', 'pwd', 'tip'], function(k, v){
      $el[v] = $(option[v]);
    });
    bindForm($el.form);
    me._init = true;
    return me;
  }
};

exports = module.exports = function(opt){
  return login.init(opt);
};

