/**
 * proxy
 */
var QueryString = require('querystring');

var _ = require('lodash');
var co = require('co');
var request = require('co-request');
var debug = require('debug')('lib:proxy');

var util = require('./util');

var config = util.setting;
var uuid = util.uuid;
var API_BASE = config.apiBase;

var rquery = (/\?/);

var CONF = {
  
};

var proxy = module.exports = function(){
  var args = _.slice(arguments);
  return co(function *(){
    var ret = yield request.apply(null, args);
    debug('request.body', ret.body);
    if( ret.statusCode === 200 && ret.body && ret.body.length ){
      return ret.body;
    }
    debug('request body status', ret.statusCode, ret.body);
    throw new Error(502, 'bad gateway');
  });
};

_.forEach(CONF, function(v, k){
  proxy[k] = function(data, opt){
    // default timeout for http
    var args = _.assign({timeout: 10000}, v);
    var cacheURL = args.uri || args.url;
    var form;
    var uri;
    var requestid;

    if( args.method && ( args.method === 'post' || args.method === 'put' || args.method === 'patch' ) ){
      requestid = uuid();
      if ( data ) {
        data._requestid = requestid;
        form = {form: data};
      }
      if ( opt ) {
        // application/x-www-form-urlencoded
        opt.form && (opt.form._requestid = requestid);
        // multipart/form-data
        opt.formData && (opt.formData._requestid = requestid);
      }
      console.log('[INFO] proxy - [%s] - %s', requestid, cacheURL, args.method);
      _.assign(args, form, opt);
    }
    if( !args.method || args.method === 'get' ){
      uri = [cacheURL, (rquery.test(cacheURL)) ? '&' : '?', QueryString.stringify(data)].join('');
      _.assign(args, {uri: uri}, opt);
    }
    debug(args, form, uri);
    return proxy(args);
  };
});
