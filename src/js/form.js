var ErrMsg = require('../../lib/errormsg');
var form = {};

form.ErrMsg = ErrMsg;

form.validate = {
  errorElement: "span",
  errorPlacement: function(place, el){
    var parent = $(el).parents('.form-group');
    var holder = $('.help-inline', parent);
    if(!holder.length){
      holder = $('<div class="help-inline"></div>').appendTo(parent);
    }
    holder.empty().removeClass('success-msg info-msg')
      .addClass('error-msg').append('<i class="fa fa-times-circle"></i>').append(place);
  },
  success: function(msg, el){
    var parent = $(el).parents('.form-group');
    var holder = $('.help-inline', parent);
    if(!holder.length){
      holder = $('<div class="help-inline"></div>').appendTo(parent);
    }
    holder.empty().removeClass('error-msg info-msg')
      .addClass('success-msg').append('<i class="fa fa-check-circle"></i>');
    $('span', holder).remove()
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
    },
    username: {
      required: ErrMsg.emptyNickName,
      remote: ErrMsg.nickNameExists,
      minlength: ErrMsg.lenNickName,
      maxlength: ErrMsg.lenNickName
    },
    invite: {
      required: ErrMsg.emptyInvite,
      minlength: ErrMsg.lenInvite,
      maxlength: ErrMsg.lenInvite
    },
    oldpassword: {
      required: ErrMsg.emptyCurrentPwd,
      minlength: ErrMsg.lenPwd,
      maxlength: ErrMsg.lenPwd
    },
    newpassword: {
      required: ErrMsg.emptyNewPwd,
      minlength: ErrMsg.lenPwd,
      maxlength: ErrMsg.lenPwd,
      notEqualTo: ErrMsg.equalPwd
    },
    cardno: {
      required: ErrMsg.emptyBankCard,
      minlength: ErrMsg.isBankCard,
      maxlength: ErrMsg.isBankCard
    },
    repassword: {
      required: ErrMsg.emptyRePwd,
      minlength: ErrMsg.lenPwd,
      maxlength: ErrMsg.lenPwd,
      equalTo: ErrMsg.rePwd
    }
  }
};

exports = module.exports = form;
