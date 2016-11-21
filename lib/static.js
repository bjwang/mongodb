/**
 * static url
 */
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp');
var mkdirpSync = mkdirp.sync;

var files = {};
var buildDir = 'build';


function loadFile(name, dir, options){
  var pathname = path.normalize(path.join(options.prefix, name));
  var obj = files[pathname] = files[pathname] ? files[pathname] : {};
  var filename = obj.path = path.join(dir, name);
  //var stats = fs.statSync(filename);
  var buffer = fs.readFileSync(filename);

  obj.md5 = crypto.createHash('md5').update(buffer).digest('hex');

  var destDir = path.dirname(path.join(dir, buildDir, pathname));
  var prefix = obj.md5 ? (obj.md5 + '.') : '';
  var dest = prefix + path.basename(pathname);
  var destPath = path.join(destDir, dest);

  obj.dest = path.join('/', buildDir, path.dirname(pathname), dest);
  // copy to new path
  if ( !fs.existsSync(destDir) ) {
    mkdirpSync(destDir);
  }
  // not exists write
  if ( !fs.existsSync(destPath) ) {
    console.log('static build to %s', obj.dest);
    fs.writeFileSync(destPath, buffer);
  }

  // release memory
  buffer = null;

  return obj;
}
function safeDecodeURIComponent(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}
/**
 * export
 */
exports = module.exports = function(setting){

  var debug = (setting && setting.debug) || false;

  return function(name, options){
    var dir = setting.static;
    options = options || {};
    options.prefix = (options.prefix || '').replace(/\/$/, '') + path.sep;

    if ( debug ) {
      return name;
    }

    var filename = safeDecodeURIComponent(path.normalize(name));
    var file = files[filename];

    if ( !file ) {
      file = loadFile(filename, dir, options);
    }
    return file.dest.replace(/\\/g, '/');
  };
};
