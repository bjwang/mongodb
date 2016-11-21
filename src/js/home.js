/**
 * home slide
 */

var home = {
  slide: function(){
    $('.home-slider').unslider({
      autoplay: true,
      delay: 7000,
      infinite: true,
      arrows: {
        prev: '<a href="javascript:;" class="unslider-arrow prev"><i class="fa fa-angle-left"></i></a>',
        next: '<a href="javascript:;" class="unslider-arrow next"><i class="fa fa-angle-right"></i></a>'
      }
    });
  },
  init: function(opt){
    var me = this;
    if ( !!me._init ) {
      return me;
    }
    me._init = true;
    return me;
  }
};

exports = module.exports = home;
