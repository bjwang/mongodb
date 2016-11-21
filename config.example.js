var path=require('path')

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 8000;
var state = process.env.STATE || 'web'; // web/mobile/api
//var state = process.env.STATE || 'mobile'; // web/mobile/api
var host = process.env.HOST || '0.0.0.0';
var view_tpl_path = path.resolve(__dirname, './tpl');

var DEBUG = (env !== 'production');
var webHost = {};

// global locals
var global_view_locals = {
  site_name: '****',
  site_title: '****',
  site_keywords: '****',
  site_description: '****'
};

var redis_session = {
  host: '192.168.1.21',
  port: '6379',
  db: 3,
  options: {
    auth_pass: '****'
  },
  keySchema: 'session',
  ttl: 24 * 60 * 60 // second
};
var redis_set = {
  host: '192.168.1.21',
  port: '6379',
  db: 3,
  options: {
    auth_pass: '****'
  }
};

var redis_get = {
  host: '192.168.1.21',
  port: '6379',
  db: 5,
  options: {
    auth_pass: '****'
  }
};

if(DEBUG){
  webHost.websit = '127.0.0.1:3000'
}

module.exports = {
  name: 'web',
  keys: ['****', 'by koa'], // signed cookie keys
  env: env,
  debug: DEBUG,
  port: port,
  state: state,
  session: {store: redis_session },
  redis: redis_get,
  redisMaster: redis_set,
  static: path.join(__dirname, 'static'),
  src: path.join(__dirname, 'src'),
  view: {
    viewPath: view_tpl_path,
    debug: DEBUG,
    pretty: DEBUG,
    compileDebug: DEBUG,
    helperPath:[
      {'UIHelper': path.resolve(__dirname, './lib/helper.js')},
      { _: require('lodash') }
    ],
    locals: global_view_locals
  },
  apiBase: '****'
};
