/**
 * news
 */
var _ = require('lodash');
var debug = require('debug')('controller:admin');
var ErrMsg = require('../lib/errormsg');
var util = require('../lib/util');

var admin = function *(next){
  yield next;
};

admin.login = function *(next){
  var ctx = this;

  ctx.render('admin.login.pug');
};

module.exports = admin;
