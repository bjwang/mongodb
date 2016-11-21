/**
 * handler signup
 */
var util = require('./util');
var verifyCode = require('./verifycode');
var ErrMsg = util.ErrMsg;
var Form = util.Form;

var $el = {};
var defaultOption = {
  form: '#J_add',
  title: '#J_title',
  class: '#J_class',
  content: '#J_editor'
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
      title: {
        required: true
      },
      class: {
        required: true
      },
      content: {
        required: true
      }
    },
    messages:{
      title: {
        required: ErrMsg.emptyMobile
      },
      class: {
        required: ErrMsg.isCaptcha
      },
      content: {
        required: ErrMsg.emptyCode
      }
    }
  });
  if ( options ) {
    $.extend(true, opt, options);
  }
  $(form).validate(opt);
  form._bindValidate = true;
}

var add = {
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
    me._init = true;
    return me;
  }
};

exports = module.exports = function(opt){
  return add.init(opt);
};
