var accounting = require('accounting');
var Form = require('./form');
var url = require('url');
var ErrMsg = require('../../lib/errormsg');


exports.reAmount = /^(?:[1-9][0-9]*)0{3}$/;
exports.reMobile = /^1[3|4|5|7|8|9][0-9]{9}$/;
exports.reNickName = /^[\u4E00-\u9FA5A-Za-z0-9_]{2,12}$/;
exports.reMobileReplace = exports.mobileReplace = /^(\d{3})(.*)(\d{4})$/;
exports.reRealnameReplace = /^(.*)(.{1})$/;
exports.reBankCardNo = /^\d{16,30}$/;
// format money
accounting.settings.currency.format = '%v';
exports.accounting = accounting;
exports.toFixed = accounting.toFixed;
exports.formatNumber = accounting.formatNumber;
exports.formatMoney = accounting.formatMoney;

exports.Form = Form;
exports.ErrMsg = ErrMsg;

// gen avatar url
exports.gen_pic_url = function(uri){
  if ( !uri || uri.length < 2 ) {
    uri = url.resolve(SNS.imgDomain, '/static/img/avatar.jpg');
  }
  if( uri ){
    return url.resolve(SNS.imgDomain, uri);
  }
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
// safe realname
exports.safeRealname = function(val){
  if (!val){
    return '**';
  }
  return val.replace(exports.reRealnameReplace, '*$2');
};
