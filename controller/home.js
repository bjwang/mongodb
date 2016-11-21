/**
 * home
 */
var _ = require('lodash');
var debug = require('debug')('controller:home');
var cache = require('../cache');
var util = require('../lib/util');
var model = require('../model');
var catModel = model.catModel();
var personModel = model.personModel();
var mongoose = require('mongoose');

var home = function *(next){
	var ctx = this;
  var _toJSON = function(v){
    return JSON.parse(v);
  };
	var _name = 'user' + Math.random();
	var kitty = new catModel({ name: _name });
	var person = [{name: 'admin', age: '20'}, {name: 'super', age: '32'}];
	// kitty.save(function(err){
	// 	//conn.close();
	// });
	personModel.create(person, function(err){

	});

	yield kitty.save().then(function(value){
		debug('home.kitty.save:', value);
	}, function(err){
		debug('home.kitty.save:', err);
	});

  yield Promise.all([
    cache.home.get_list_product(),
    cache.home.get_banner_list()
  ]).then(function(values){
    debug('home.product', values[1]);
    _.assign(ctx.state, {
      productList: _.get(values[0], 'data.dataList'),
      bannerList: values[1]
    });
  }, function(error){
    debug('home.all.error', error);
  });

	ctx.render('home.pug');
};

module.exports = home;
