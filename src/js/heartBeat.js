// heartbeat

var timer;
// 19 minutes
var interval =  19 * 60 * 1000;
function beat(){
  $.get('/api/heartbeat', {time: (new Date()).getTime()});
}
// export
exports = module.exports = function(){
  if( timer ){
    clearTimeout(timer);
  }
  timer = setInterval(beat, interval);
};
