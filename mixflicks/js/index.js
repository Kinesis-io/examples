$.fn.activate = function(){
  var me = $(this);
  me.addClass('active');

  me.parents('.tiles').prev().find('.active').removeClass('active');
  me.parents('.tiles').prev().find('#' + $(this).attr('data-name').replace(' ', '')).addClass('active');

  return me;
}

$.fn.slideLeft = function(){
  var tiles  = $(this);
  var _index = tiles.find('.tile').index(tiles.find('.tile.active')[0]);
  var _left  = tiles.find('.tile').width() * (_index + 1);

  tiles.addClass('slideIn');

  if (_index < tiles.find('.tile').length - 1) {
    tiles.css("-webkit-transform",
      "translate(-" + _left + "px, 0)"
    );
    tiles.css("-moz-transform",
      "translate(-" + _left + "px, 0)"
    );

    tiles.find('.tile.active').removeClass('active').next().activate();
  }

  setTimeout(function(){
    tiles.removeClass('slideIn');
  }, 1000);
}

$.fn.slideRight = function(){
  var tiles  = $(this);
  var _index = tiles.find('.tile').index(tiles.find('.tile.active')[0]);
  var _left  = tiles.find('.tile').width() * (_index - 1);

  tiles.addClass('slideOut');

  if (_index > 0) {
    tiles.css("-webkit-transform",
      "translate(-" + _left + "px, 0)"
    );
    tiles.css("-moz-transform",
      "translate(-" + _left + "px, 0)"
    );

    tiles.find('.tile.active').removeClass('active').prev().activate();
  }

  setTimeout(function(){
    tiles.removeClass('slideOut');
  }, 1000);
}

var KLayout = {
  pageSize : null,
  tileSize : null,
  detailSize : null,

  reload : function(){
    var _page       = $('#content');
    KLayout.pageSize = { width: _page.width(), height: _page.height() };

    var _padding    = KLayout.pageSize.width - $('.grid .tiles .tile ul:first').width();
    var _tileWidth  = KLayout.pageSize.width - _padding/3*2;
    KLayout.tileSize = { width : _tileWidth, height : $('.grid .tiles .tile:first').height() };

    $('.grid .tiles .tile').css({ width: _tileWidth + 'px' });
    $('.grid .tiles').css({ 'padding-left': (KLayout.pageSize.width - _tileWidth)/2 + 'px' });

    var _padding      = KLayout.pageSize.width - $('.details .tiles .tile .content:first').width();
    var _tileWidth    = KLayout.pageSize.width - _padding/3*2;
KLayout
    $('.details .tiles .tile').css({ width: _tileWidth + 'px' });
    $('.details .tiles').css({ 'padding-left': (KLayout.pageSize.width - _tileWidth)/2 + 'px' });
  },
  init : function(){
    KLayout.reload();
    $('.tiles .tile:first-child').activate();

    $(window).resize(function() {
      //KLayout.reload();
    });
  }
}

$(function() {
  $.each($('#content>div'), function(){
    var me      = $(this);
    var toolbar = me.find('.toolbar');
    $.each(me.find('.tile'), function(){
      toolbar.append('<li id="' + $(this).attr('data-name').replace(' ', '') + '">' + $(this).attr('data-name') + '</li>')
    });
  });

  setTimeout(function(){
    KLayout.init();
  }, 10);

  setTimeout(function(){
    //$('#content .ui-page-active .tiles').slideLeft();
  }, 100);

  $('.content.trailer').click(function(){
    $('.ui-page-active').addClass('playing');
    var video = $('.ui-page-active video')[0];
    video.currentTime = 0;
  });
  $('.background video').click(function(){
    $('.ui-page-active').removeClass('playing');
  });

  $('.ui-page-active.active').live('click', function(){
    $('.ui-page-active').removeClass('playing');
  });
  $('.ui-page-active #close').live('click', function(){
    $('.ui-page-active').removeClass('playing');
  });
});

$('[data-role=page]').live('pageshow', function(event){
  var _page = $( event.target );
  setTimeout(function(){
    var _position = _page.find('.active .content').offset();
    _page.find('.toolbar').css({ left: 100 + 'px', top: (_position.top - 100) + 'px', opacity: 1.0 });
  }, 1000);
});