var util = require('./util');
var ErrMsg = util.ErrMsg;

;(function($){
  $.validator.addMethod('isNickName', function(value, element) {
    return this.optional(element) || util.reNickName.test(value);
  }, ErrMsg.isNickName);
  $.validator.addMethod('isBankCardNo', function(value, element) {
    return this.optional(element) || util.reBankCardNo.test(value);
  }, ErrMsg.isNickName);
  $.validator.addMethod('isMobile', function(value, element) {
    return this.optional(element) || util.reMobile.test(value);
  }, ErrMsg.isMobile);
  $.validator.addMethod('isAmount', function(value, element) {
    return this.optional(element) || util.reAmount.test(value);
  }, ErrMsg.isAmount);
  $.validator.addMethod('notEqualTo', function(value, element, param) {
    var target = $( param );
    if ( this.settings.onfocusout ) {
      target.unbind( ".validate-equalTo" ).bind( "blur.validate-equalTo", function() {
        $( element ).valid();
      });
    }
    return value !== target.val();
  }, '');
})(jQuery);
