/**
 * service
 */
var _ = require('lodash');
var debug = require('debug')('controller:service');

var def_nav = false;

var service = function *(){
  var ctx = this;
  var _action = ctx.checkParams('action').value || def_nav;
  var _tpl = 'product.service.pug';
  debug('service:::');
  if(_action && _action == 'overseas'){
    _tpl = 'overseas.home.pug';
    debug('service.overseas');
  }
  ctx.render(_tpl);
};

module.exports = service;
