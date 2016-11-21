/**
* account
*/

var _ = require('lodash');

var util = require('../lib/util');
var ErrMsg = require('../lib/errormsg');
var debug = require('debug')('controller:account');

var account = function *(next){
	yield next;
};

account.home = function *(){
	var ctx = this;
  var _userId = _.get(ctx.state, 'user.id', 0) - 0;
  yield ctx.proxy.myOrderList({userId: _userId})
    .then(function(value){
      debug('my.order:', value);
      var ret = JSON.parse(value);
      if(ret.status !== 0){
        return;
      }
      ctx.state.orderList = _.get(ret, 'data.dataList') || [];
    }, function(error){
      debug('account.order.list.error:', error);
    });
	ctx.render('account.home.pug');
};

module.exports = account;
