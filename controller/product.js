/**
 * product
 */
var _ = require('lodash');
var debug = require('debug')('controller:news');
var ErrMsg = require('../lib/errormsg');
var util = require('../lib/util');

var product = function *(next){
  yield next;
};

product.detail = function *(){
  var ctx = this;
  var _id = ctx.checkParams('id').isInt().toInt().value;

  yield ctx.proxy.productDetail({productId: _id})
    .then(function(value){
      debug('product.detail.value', value);
      var ret = JSON.parse(value);
      if( ret.status !== 0 ){
        ctx.addError('page', ErrMsg.productNoError);
        return;
      }
      ctx.state.productDetail = _.get(ret, 'data') || []
    }, function(error){
      debug('product.detail.error', error);
    });

  ctx.render('product.detail.pug');
};

product.order = function *(){
  var ctx = this;
  var status;
  var data = {};
  var msg = msg || ErrMsg.def;
  var _userId = _.get(ctx.state, 'user.id', 0) - 0;
  var _productId = ctx.checkBody('productId').isInt().toInt().value || 1;
  var _tplResult = './mod/product.order.result.pug';
  debug('user.id', _userId);
  var _data = {
    userId: _userId,
    productId: _productId,
    ipAddress: ctx.ip
  };
  if(ctx.error){
    ctx.dumpJSON(403, msg)
  }
  yield ctx.proxy.productOrder(_data)
    .then(function(value){
      debug('product.order.value::', value);
      var ret = JSON.parse(value);
      ctx.state.productId = _productId;
      if(ret.status !== 0){
        ctx.state.result = 0;
        ctx.state.msg = _.get(ret, 'message') || '';
        ctx.render(_tplResult);
        data.html = ctx.body;
        ctx.dumpJSON(data);
        return;
      }
      ctx.state.result = 1;
      ctx.render(_tplResult);
      data.html = ctx.body;
      debug('product.order.data', data);
      ctx.dumpJSON(data);
    }, function(error){
      ctx.dumpJSON(500, msg);
      debug('product.order.error', error);
    });
};

module.exports = product;
