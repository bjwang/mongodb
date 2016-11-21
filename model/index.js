var mongoose = require('mongoose');
var util = require('../lib/util');
var debug = require('debug');

var mogodbConn = mongoose.createConnection(util.setting.uri);

mogodbConn.on('error',console.error.bind(console,'连接错误:'));
mogodbConn.once('open',function(){
  debug('mongodb.conn');
});

var catSchema = new mongoose.Schema({
  name: String
});
var personSchema = new mongoose.Schema({
  name: String,
  age: String
});
var articleSchema = new mongoose.Schema({
  title: String,
  class: String,
  content: String,
  createTime: [Date],
  updateTime: [Date]
});

var adminSchema = new mongoose.Schema({
  name: String,
  password: String,
  ip: String,
  loginTime: [Date],
  logoutTime: [Date]
});

exports.catModel = function(){
  return mogodbConn.model('cat', catSchema);
}

exports.personModel = function(){
  return mogodbConn.model('user', personSchema);
}

exports.articleModel = function(){
  return mogodbConn.model('article', articleSchema);
}

exports.adminModel = function(){
  return mogodbConn.model('admin', adminSchema);
}

exports.conn = mogodbConn;
