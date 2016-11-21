/**
 * verifycode
 */
var util = require('./util');
var ErrMsg = util.ErrMsg;

var isSubmiting = false;
var $el = {};
var defaultOption = {
  action: 'signup',
};
var option;

var _timer;
var _count = 0;
var defCount = 60;

function disableVerify(){
  $el.trigger.prop('disabled', true).text(['再次获取(', _count , ')'].join(''));
  isSubmiting = true;
}
function enbaleVerify(){
  _count = 0;
  clearTimeout(_timer);
  $el.trigger.prop('disabled', false).text($el.trigger.data('origin'));
  isSubmiting = false;
};
function countDown(){
  disableVerify();
  if ( _count <=0 ) {
    enbaleVerify();
  }
  _count--;
};
function startCountDown(){
  _count = defCount;
  countDown();
  _timer = setInterval(function(){
    countDown();
  }, 1000);
};
function showError(msg){
  $el.validator.showErrors({
    mobile: msg
  });
  $el.input.focus();
}
function send(data){
  $.post('/api/verifycode/send', data)
    .done(function(json){
      if(json.status !== 0){
        showError(json.message);
        return;
      }
    }).fail(function(err){
      enbaleVerify();
    });
};
function bindEvent(){
  var trigger = $el.trigger;
  trigger.data('origin', trigger.text());
  trigger.on('click', function(){
    var data = {
      action: option.action
    };
    if ( isSubmiting ) {
      return;
    }
    if ( $el.input && $el.input.length ) {
      data.mobile = $el.input.val();
      if ( $el.input.valid && !$el.validator.element($el.input) ) {
        $el.input.focus()
        return;
      }
    }
    if ( $el.captcha && $el.captcha.length ) {
      data.captcha = $el.captcha.val();
      if ( $el.captcha.valid && !$el.validator.element($el.captcha) ) {
        $el.captcha.focus()
        return;
      }
    }
    startCountDown();
    send(data);
  });
  $el.captchaimg.on('click', function(){
    var $target = $($(this).data('target'));
    var src = $target.data('src');
    $target.attr('src', (src + '?' + Math.random()));
    return false;
  })
};

var verifycode = {
  init: function(opt){
    var me = this;
    option = $.extend({}, defaultOption, opt);
    $.each(['input', 'trigger', 'captcha', 'captchaimg'], function(k, v){
      $el[v] = $(option[v]);
    });
    if ( $el.input && $el.input.length ) {
      $el.form = $($el.input.get(0).form);
      $el.validator = $el.form.validate();
    }
    if ( $el.captcha && $el.captcha.length ) {
      $el.form = $($el.captcha.get(0).form);
      $el.validator = $el.form.validate();
    }
    bindEvent();
    return me;
  }
};

exports = module.exports = function(opt){
  return verifycode.init(opt);
};
