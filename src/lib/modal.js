(function($){
  $.fn.extend({
    modal: function(options){
      var content = $(this);
      var o = options;
      var defaults = {
        width: 600,
        height: 300,
        top: 0,
        left: 0,
        position : 'fixed',
        zindex: 10,
        closeButton: null
      };
      var overlay = $("<div id='J_modal_bg' class='modal-cover'></div>");
      this.show = o.show || false;
      this.close = o.close || false;
      if(this.show){
        $('body').append(overlay);
        overlay.css({ 'display' : 'block'});
        o =  $.extend(defaults, o);
        content.css({
          'display' : 'block'
        });
        content.find('.modal-dialog').css({
          'width': o.width + 'px',
          'height': o.height + 'px'
        });
        // content.click(function() {
        //   close_modal(content);
        // });
      }
      if(this.close){
        content.click(function() {
          close_modal(content);
        });
      }
      $('#J_modal').find('.modal-dialog').on('click', function(e){
        e.stopPropagation();
      });
      $('body #J_cancel').on('click', function(){
        close_modal(content);
      });
      function close_modal(modal_id){
        $('#J_modal_bg').fadeOut(200);
        $('body #J_modal_bg').remove();
        $(modal_id).css({ 'display' : 'none' });
      }
    }
  });
})(jQuery);
