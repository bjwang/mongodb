/**
 * account pass
 */
var util = require('./util');
var verifyCode = require('./verifycode');

var Form = util.Form;

var $el = {};
var defaultOption = {
  form: '#J_changepwd-form',
  oldpwd: '#J_oldpassword',
  newpwd: '#J_newpassword',
  repwd: '#J_repassword',
  captcha: '#J_captcha',
  captchaimg: '.J_captcha-refresh',
};
var option;

function bindValidate(form, options){
  var opt;
  if ( !!form._bindValidate ) {
    return form;
  }
  // message was in Form.validate
  opt = $.extend({}, Form.validate, {
    rules:{
      repassword: {
        required: true,
        minlength: 3,
        maxlength: 20,
        equalTo: '#J_newpassword'
      }
    }
  });
  if ( form.mobile ) {
    $.extend(opt.rules, {
      mobile: {
        required: true,
        digits: true,
        isMobile: true,
        minlength: 11,
        maxlength: 11
      }
    });
  }
  if ( form.password ) {
    $.extend(opt.rules, {
      password: {
        required: true,
        minlength: 3,
        maxlength: 20
      }
    });
  }
  if ( form.newpassword ) {
    $.extend(opt.rules, {
      newpassword: {
        required: true,
        minlength: 3,
        maxlength: 20,
        notEqualTo: '#J_oldpassword'
      }
    });
  }
  if ( form.oldpassword ) {
    $.extend(opt.rules, {
      oldpassword: {
        required: true,
        minlength: 3,
        maxlength: 20
      }
    });
  }
  if ( form.smscode ) {
    $.extend(opt.rules, {
      smscode: {
        required: true,
        minlength: 6,
        maxlength: 6
      }
    });
  }
  if ( options ) {
    $.extend(true, opt, options);
  }
  //console.log(opt);
  $(form).validate(opt);
  form._bindValidate = true;
}

function init(opt){
  var me = this;
  if ( !!me._init ) {
    return me;
  }
  option = $.extend({}, defaultOption, opt);
  $.each(['form', 'oldpwd', 'newpwd', 'repwd', 'mobile', 'trigger'], function(k, v){
    $el[v] = $(option[v]);
  });
  bindValidate($el.form.get(0), option.validateOption);
  if ( $el.trigger && option.action ) {
    me._verifycode = verifyCode({
      action: option.action,
      input: $el.mobile,
      trigger: $el.trigger,
      captcha: option.captcha,
      captchaimg: option.captchaimg
    });
  }
  me._init = true;
  return me;
}

exports = module.exports = function(opt){
  return init(opt);
};
