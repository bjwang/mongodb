/**
 * jade ui helper
 */
var url = require('url');

var accounting = require('accounting');

var util = require('./util');
var statics = require('./static')(util.setting);
var moment = util.moment;
var _ = util.lodash;

// format money
accounting.settings.currency.format = '%v';
exports.accounting = accounting;
exports.toFixed = accounting.toFixed;
exports.safeMobile = util.safeMobile;
exports.formatNumber = accounting.formatNumber;
exports.formatMoney = accounting.formatMoney;
exports.CATEGORY_STOCK = util.CATEGORY_STOCK; // 私募股权
exports.CATEGORY_SECURITIES = util.CATEGORY_SECURITIES; // 私募证券
exports.pageCount = util.pageCount;
// static url
exports.static_url = statics;
// format date
exports.moment = moment;
// format date
exports.formatdate = function (format, date) {
  format = format || 'YYYY-MM-DD';
  var time = date || new Date();
  return moment(time).format(format);
};

// cut string
exports.cutStr = function(val, len, ellipsis){
  len = (len - 0) || 10;
  ellipsis = ellipsis ? ellipsis : '...';
  if ( !val ) {
    return '';
  }
  var _len = val.length;
  var max = len + 2;
  if ( _len < max ) {
    return val;
  }
  return val.slice(0, len) + ellipsis;
};

// follow list release
exports.releaseTime = function(startTime, endTime){
  var countUpTime = accounting.formatNumber((endTime - startTime) / (1000 * 60 * 60 * 24));
  if(countUpTime >= 1){
    return countUpTime + '<span>天</span>';
  }else{
    return '<span>不足</span>1<span>天</span>';
  }
};

/*
 * article type
 */
exports.articleType = function(id){
  var ret = {};
  var keys = ['investment', 'assert', 'private'];
  keys.forEach(function(k){
    if ( keys[id] == k ) {
      ret[k] = true;
    }else {
      ret[k] = false;
    }
  });
  return ret;
};
