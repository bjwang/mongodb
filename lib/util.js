/**
 * util
 */
var url = require('url');
var queryString = require('querystring');

var _ = require('lodash');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var debug = require('debug')('lib:util');

//var bank = require('./bank');
//var conf = require('./conf');

var setting = require('../config');

moment.locale('zh-cn');
exports.moment = moment;
exports.lodash = _;
exports.reRealname = /^[\u0391-\uFFE5]{2,6}$/;
exports.reNickName = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,12}$/;
exports.reMobile = /^1[3|4|5|7|8|9][0-9]{9}$/;
exports.reSms = /^[0-9]{6}$/;
exports.reAmount = /^(?:[1-9][0-9]*)0{3}$/;
exports.reAvatarType = /(jpg|jpeg|png)$/i;
exports.reAvatarCrop = /^(\d+)(_\d+){2}/;
exports.reMobileReplace = exports.mobileReplace = /^(\d{3})(.*)(\d{4})$/;
exports.reIdentityReplace = /^(.{2})(.*)(.{2})$/;
exports.reBankCardReplace = /^(.{4})(.*)(.{4})$/;
exports.reRealnameReplace = /^(.*)(.{1})$/;
exports.checkBbsUrl = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
exports.avatarSizeLimit = 2 * 1024 * 1024; // upload avatar max size 2m
exports.setting = setting;
exports.debug = setting.debug;
// bbs admin can not used by www
exports.BADWORDS = ['盈盈', '乐乐'];
exports.AJAX_ERROR = {status: 403, message: 'params required', data: null};
exports.AJAX_SUCCESS = {status: 0, message: 'success', data: null};
// product category
exports.CATEGORY_STOCK = 0; // 私募股权
exports.CATEGORY_SECURITIES = 1; // 私募证券
exports.now = function(fmt){
  fmt = fmt || 'YYYY-MM-DD HH:mm:ss.SSS';
  return moment().format(fmt);
};
/**
 * safe mobile
 */
exports.safeMobile = function(val){
  if ( !val || val.length < 7 ) {
    return '****';
  }
  return val.replace(exports.mobileReplace, '$1****$3');
};
/**
 * calc page count
 */
exports.pageCount = function(total, size){
  return Math.floor( (total + size - 1 ) / size);
};
/**
 * uuid
 */
exports.uuid = function(){
  return uuid();
};
/**
 * redis key user
 */
exports.k_mobile = function(mobile){
  return ['m:', mobile].join('');
};
/**
 * 验证码redis key
 */
exports.k_verify = function(mobile){
  return ['v:', mobile].join('');
};
/**
 * list page params
 */
exports.getListPageData = function(opt){
  var page = this.checkQuery('page').default(0).value - 0 || 1;
  var data = _.extend({}, {
    pageNumber: page,
    pageSize: 10,
    ipAddress: this.ip
  }, opt);
  return data;
};
/**
 * encrypt password
 */
exports.bhash = function(val){
  if ( setting.debug ) {
    return val;
  }
  try{
    return bcrypt.hashSync(val);
  } catch (error){
    debug('bcrypt.bhash', error);
  }
  return val;
};
exports.bcompare = function(val, hash){
  if ( setting.debug ) {
    return val === hash;
  }
  try{
    return bcrypt.compareSync(val, hash);
  }catch (error){
    debug('bcrypt.bcompare', error);
  }
  return false;
};
/**
 * arrary to object
 */
exports.arr2obj = function(arr){
  var obj = {};
  arr.forEach(function(el){
    Object.keys(el).forEach(function(k){
      if( !obj[k] ){
        obj[k] = [];
      }
      obj[k].push(el[k]);
    });
  });
  return obj;
};
