/**
 * handler signup
 */
var util = require('./util');
var verifyCode = require('./verifycode');
var ErrMsg = util.ErrMsg;
var Form = util.Form;

var $el = {};
var defaultOption = {
  form: '#J_signup-form',
  mobile: '#J_mobile',
  captcha: '#J_captcha',
  captchaimg: '.J_captcha-refresh',
  trigger: '#J_verifycode'
};
var option;

function bindValidate(form, options){
  var opt;
  if ( !form || !!form._bindValidate ) {
    return form;
  }
  // messages was in Form.validate
  opt = $.extend({}, Form.validate, {
    rules:{
      mobile: {
        required: true,
        digits: true,
        isMobile: true,
        minlength: 11,
        maxlength: 11,
        remote: {
          url: '/api/checkmobile',
          method: 'post'
        }
      },
      captcha: {
        required: true,
        minlength: 4,
        maxlength: 6,
        remote: {
          url: '/api/checkcaptcha',
          method: 'post'
        }
      },
      smscode: {
        required: true,
        minlength: 6,
        maxlength: 6
      },
      password: {
        required: true,
        minlength: 3,
        maxlength: 20
      }
    },
    messages:{
      mobile: {
        required: ErrMsg.emptyMobile,
        minlength: ErrMsg.isMobile,
        maxlength: ErrMsg.isMobile,
        remote: ErrMsg.mobileExists,
        digits:  ErrMsg.isMobile
      },
      captcha: {
        required: ErrMsg.isCaptcha,
        remote: ErrMsg.isCaptcha,
        minlength: ErrMsg.isCaptcha,
        maxlength: ErrMsg.isCaptcha
      },
      smscode: {
        required: ErrMsg.emptyCode,
        minlength: ErrMsg.isCode,
        maxlength: ErrMsg.isCode
      },
      password: {
        required: ErrMsg.emptyPwd,
        minlength: ErrMsg.lenPwd,
        maxlength: ErrMsg.lenPwd
      }
    }
  });
  if ( options ) {
    $.extend(true, opt, options);
  }
  $(form).validate(opt);
  form._bindValidate = true;
}

var signup = {
  init: function(opt){
    var me = this;
    if ( !!me._init ) {
      return me;
    }
    option = $.extend({}, defaultOption, opt);
    $.each(['form'], function(k, v){
      $el[v] = $(option[v]);
    });

    bindValidate($el.form.get(0), option.validateOption);
    // verifycode
    me._verifycode = verifyCode({
      action: 'signup',
      input: option.mobile,
      trigger: option.trigger,
      captcha: option.captcha,
      captchaimg: option.captchaimg
    });
    me._init = true;
    return me;
  }
};

exports = module.exports = function(opt){
  return signup.init(opt);
};
