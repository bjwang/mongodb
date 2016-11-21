/**
 * about
 */
var _ = require('lodash');
var util = require('../lib/util');
var debug = require('debug')('controller:editor');
var mongoose = require('mongoose');
var model = require('../model')
var articleModel = model.articleModel();

var editor = function *(next){
	var ctx = this;
	yield next;
};
editor.add = function *(next){
  var ctx = this;

  ctx.render('add.pug');
};
editor.addPost = function *(next){
	var ctx = this;
	var _title = ctx.checkBody('title').notEmpty().value;
	var _class = ctx.checkBody('class').notEmpty().value;
	var _content = ctx.checkBody('content').value;
	var _data = new Date();

	debug('add.article.list.title', _title);
	debug('add.article.list.class', _class);
	debug('add.article.list.content', _content);
	var _data = {
		title: _title,
		class: _class,
		content: _content,
		createTime: _data
	}

	yield articleModel.create(_data, function(err){
		if(err) {
        console.log(err);
    } else {
        console.log('save ok');
    }
	});

	ctx.render('add.pug');
}
editor.list = function *(next){
	var ctx = this;
	var data = util.getListPageData.call(this);
	var start = (data.pageNumber - 1) * data.pageSize;
  _.extend(ctx.state, {
    page: data.pageNumber,
    pageSize: data.pageSize,
    pageUrl: '?page='
  });

	yield Promise.all([
		articleModel.count({}),
		articleModel.find({}).skip(start).sort({ _id: -1 }).limit(data.pageSize)
	]).then(function(values){
		var ret = values[1];
		var total = values[0] || 0;
		var size = data.pageSize;
		var count = util.pageCount(total, size);

		_.extend(ctx.state, {
			articleList: ret || [],
			totalCount: total,
			pageTotal: count
		});
		debug('article.list.val', count);
  }, function(error){
    debug('article.list.error', error);
  });;

	ctx.render('list.pug');
}

editor.detail = function *(next){
	var ctx = this;
	var _id = ctx.checkParams('id').isInt().toInt().value;
	debug('article.id', _id);
	yield articleModel.findById(_id, function(err, value){
		debug('article.detail.value', value);
		ctx.state.articleDetail = value;
	});
	ctx.render('detail.pug');
}

editor.del = function *(next){
	var ctx = this;
	var _id = ctx.checkParams('id').isInt().toInt().value;

	yield articleModel.findByIdAndRemove(_id, function(err, value){
		debug('article.delete.value:', value);
	})

	ctx.redirect('/list');
}

module.exports = editor;
