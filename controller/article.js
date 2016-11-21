/**
 * news
 */
var _ = require('lodash');
var debug = require('debug')('controller:news');
var ErrMsg = require('../lib/errormsg');
var util = require('../lib/util');

var article = function *(next){
  yield next;
};

article.list = function *(){
  var ctx = this;
  var data = util.getListPageData.call(this);
  _.extend(ctx.state, {
    page: data.pageNumber,
    pageSize: data.pageSize,
    pageUrl: '?page='
  });
  yield ctx.proxy.articleList(data)
    .then(function(values){
      debug('article.list:', values);
      var ret = JSON.parse(values);
      if(ret.status !== 0){
        ctx.addError('page', ErrMsg.articleError);
        return;
      }
      var total = ret.data.totalCount || 0;
      var size = data.pageSize;
      var count = util.pageCount(total, size);
      debug('article.list.page', total, size, count);
      _.extend(ctx.state, {
        articleList: _.get(ret, 'data.dataList') || [],
        totalCount: total,
        pageTotal: count
      });
    }, function(error){
      debug('article.list.error', error);
    });
  ctx.render('article.list.pug');
};
article.detail = function *(){
  var ctx = this;
  var _id = ctx.checkParams('id').isInt().toInt().value;
  yield ctx.proxy.articleDetail({articleId: _id})
    .then(function(values){
      debug('article.detail:', values);
      var ret = JSON.parse(values);
      if(ret.status !== 0){
        ctx.addError('page', ErrMsg.articleError);
        return;
      }
      ctx.state.articleDetail = _.get(ret, 'data') || []
    }, function(error){
      debug('article.detail.error', error);
    });
  ctx.render('article.detail.pug');
};

module.exports = article;
