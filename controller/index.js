var Router = require('koa-router');

var home = require('./home');
var about = require('./about');
var user = require('./user');
var tpl = require('./tpl');
var account = require('./account');
var article = require('./article');
var product = require('./product');
var limit = require('./limit');
var service = require('./service');
var cache = require('./cache');
var editor = require('./editor');
var config = require('../lib/util').setting;
var ueditor = require('koa-ueditor')('static');
var admin = require('./admin');

function webRouter(){
	var router = new Router();
	// var accountRouter = new Router({
	// 	prefix: '/account'
	// });

	router
    // api
    .post('/api/product/order', product.order)
    .post('/api/investConfirm', user.loginRequired, user.investConfirm)
    // login & regnup
		.get('/login', user.loginCheck, user.login)
		.post('/login', user.loginCheck, user.loginPost)
    .get('/signup', user.loginCheck, user.signup)
    .post('/signup', user.loginCheck, user.verifyCaptcha, user.signupPost)
    .get('/singup/success', user.result)
    .get('/forgot', user.loginCheck, user.forgot)
    .post('/forgot', user.loginCheck, user.forgot)
    .get('/captcha', user.captcha)
    .post('/api/checkmobile', user.checkMobile)
    .post('/api/checkexistmobile', user.checkExistMobile)
    .post('/api/checkcaptcha', user.verifyCaptcha, user.checkCaptcha)
    .post('/api/verifycode/send', limit.ipLimit, user.verifyCaptcha, user.sendVerifyCode)
    .all('/logout', user.logout)
		.all('/ueditor/ue', ueditor)
		//admin
		.get('/admin', admin.login)
		//account
    .get('/account', user.loginRequired, account.home)
    // news
    .get('/article', article.list)
    .get('/article/:id', article.detail)
		// editor
		.get('/add', editor.add)
		.get('/list', editor.list)
		.get('/add/:id', editor.detail)
		.post('/add', editor.addPost)
		.get('/del/:id', editor.del)
    //service
    .get('/service', service)
    .get('/service/:action', service)
    // product detail
    .get('/product/:id', user.qualified, product.detail)
    // about
		.get('/about', about)
    .get('/agreement', about.aggreMent)
    .get('/purge', cache)
    .get('/purge/:id', cache)
		.get('/', home);

	return router;
}

function mobileRouter(){}

module.exports = function(config){
  var state = config.state || 'web';
  if ( state === 'mobile' ) {
    return mobileRouter();
  }
  return webRouter();
};
