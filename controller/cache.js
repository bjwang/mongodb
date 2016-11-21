'use strict';

var cache = require('../cache');

exports = module.exports = function *(){
  var ctx = this;
  var id = ctx.checkParams('id').trim().value;

  if ( id ) {
    cache.del(id);
    if ( id === '*' ) {
      cache.clear();
    }
    ctx.redirect('/purge');
  }

  ctx.state.keys = cache.keys();
  ctx.state.cache = cache;
  ctx.render('cache.pug');
};
