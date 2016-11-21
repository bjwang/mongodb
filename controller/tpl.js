/**
 * mobile tpl
 */
var _ = require('lodash');
var debug = require('debug')('controller:tpl');

var util = require('../lib/util');

var AJAX_ERROR = util.AJAX_ERROR;
var AJAX_SUCCESS = util.AJAX_SUCCESS;

var tpl = function *(next){
  try {
    yield next;
  } catch (err){
  };
};

// tpl
tpl.html = function(template){
  return function *(next){
    var ctx = this;
    var status;
    var _tpl;
    debug('tpl.html.start', status);
    status = ctx.status;
    debug('tpl.html.middle', status);
    // tpl may change by state
    _tpl = _.get(ctx.state, 'tpl', template);
    if(ctx.errors){
      ctx.state.errors = ctx.errors;
      debug('tp.html', ctx.errors);
      ctx.render(_tpl);
      return;
    }
    debug('tpl.html.end', status);
    ctx.render(_tpl);
  };
};

// json
tpl.json = function *(next){
  var ctx = this;
  var success = _.clone(AJAX_SUCCESS);
  var fail = _.clone(AJAX_ERROR);
  if (ctx.errors) {
    ctx.body = fail;
    return ;
  }
  success.data = _.get(ctx.state, 'data', {});
  ctx.body = success;
};

// json html
tpl.jsonHtml = function(template){
  return function *(next){
    var ctx = this;
    var success = _.clone(AJAX_SUCCESS);
    var fail = _.clone(AJAX_ERROR);
    var _tpl;
    if (ctx.errors) {
      debug('ctx.errors:', fail);
      fail.data = util.arr2obj(ctx.errors);
      ctx.body = fail;
      return ;
    }
    _tpl = _.get(ctx.state, 'tpl', template);
    debug('tpl.jsonHtml', _tpl);
    ctx.render(_tpl);
    success.data = _.get(ctx.state, 'data', {});
    success.data.html = ctx.body;
    //debug('success:', success);
    ctx.body = success;
  };
};

module.exports = tpl;
