/**
 * product detail
 */
var util = require('./util');
var ErrMsg = util.ErrMsg;

var productDetail = {
  confirm: function(){
    var me = this;
    $('#J_order').on('click', function(){
      $('#J_modal_confirm').modal({
        show: true,
        close: false
      });
    });
    me.order();
  },
  order: function(){
    var me = this;
    var data = {
      productId: me.productId
    };
    $('#J_confirm_sure').on('click', function(){
      var holder = $(this).parent('.modal-confirm');
      $.post('/api/product/order', data)
        .done(function(json){
          console.log(json);
          var ret = json;
          holder.html(ret.data.html);
        });
    });
  },
  init: function(opt){
    var me = this;
    if ( !!me._init ) {
      return me;
    }
    var productId = me.productId = opt.productId;
    me.confirm();
    me._init = true;
    return me;
  }
};

exports = module.exports = productDetail;

