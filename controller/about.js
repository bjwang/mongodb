/**
 * about
 */
var _ = require('lodash');
var debug = require('debug')('controller:about');
var mongoose = require('mongoose');
var model = require('../model')
var catModel = model.catModel();
var personModel = model.personModel();

var about = function *(){
	var ctx = this;
	catModel.find(function(err, response){
		//var _name = _.get(response, 'name') || ''
		debug('about.mongodb', response);
	});
	personModel.find(function(err, response){
		debug('about.mongodb.person:', response);
	});
  ctx.render('about.pug');
};
about.aggreMent = function *(){
  var ctx = this;
  ctx.render('agreement.pug');
};

module.exports = about;
