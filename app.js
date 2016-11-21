var app = require('koa')();

var util = require('./lib/util');
var db = require('./lib/db');
var serveStatic = require('koa-static');
var validate = require('koa-validate');
var sessionRedis = require('koa-session-redis3');
var config = util.setting;
var router = require('./controller')(config);
var Pug = require('koa-pug');
var pug = new Pug(config.view);
var debug = require('debug')('app');
var csrf = require('koa-csrf');
var bodyParser = require('koa-body');
var middleware = require('./lib/middleware');


// init conifg
app.name = config.name;
app.env = config.env;
app.keys = config.keys;
app.proxy = true;
app.config = config;

// debuging
app.use(middleware.debuging);

// body
app.use(bodyParser({
  formLimit: '50mb',
}));


// validate
app.use(validate());

// session
app.use(sessionRedis(config.session));

//addError
app.use(middleware.addError);
app.use(middleware.dumpJSON);

//csrf
csrf(app);
app.use(middleware.csrf);

// db
app.use(db());

// state
app.use(middleware.state);

// pug template
pug.use(app);

// router
app.use(router.routes());

// static
app.use(serveStatic(config.static));
app.use(serveStatic(config.src));

app.listen( config.port, config.host, function(){
    console.log('[INFO] Server running on http://%s:%s ', config.host, config.port);
  });
