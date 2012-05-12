$.fn.gridfy  = function(options){
	// General
	var main = this,
	
		// Set up the default options
		defaults = { 
			// Public 
			elementOpts: {class: 'tileItem'}, 							// target (div) holding tile
			contentOpts: {class: 'content'}, 								// tile content
			captionOpts: {class: 'caption'}, 								// tile caption
			sizeOfGrid: {height: '150px', width: '225px'}, 	// tile height and width
			totalTileCount: 5,		 													// total no. of tiles in grid
			tileCountPerColumn: 0, 													// no. of tiles per column
			content_json: [],
			gridWidthOffset: 20															// set total offset needed as per padding and margin of the grid layout
		};
		// Now overwrite the default options with the ones passed in
		options = $.extend(defaults, options),
		window_width = $(window).width();
		window_height = $(window).height();
	
	// function create grid element
	
	function createTile() {
		var new_tile = document.createElement("div");
		$.each(options.elementOpts, function(property, value) {
			new_tile.setAttribute(property, value);
			new_tile.style.width = options.sizeOfGrid.width;
			new_tile.style.height = options.sizeOfGrid.height;
			
			var content = "<div class='content'>content goes here...</div>";
			var caption = "<div class='caption'><span>caption goes here...</span></div>"
			new_tile.innerHTML = content + caption;
		});
		
		return new_tile;
	}
	
	// function create grid layout
	
	function createGridLayout() {
		if(options.content_json.length != 0) {			
			$.each(options.content_json, function(i, value){
				var tile = createTile();
				$(tile).find('.content').html(value.content);
				$(tile).find('.caption').html(value.caption);
				main.append(tile);
			});
		}
		else {
			for(var i=0; i<options.totalTileCount; i++) {
				var tile = createTile();
				main.append(tile);
			}
		}
		wrapWithTile();
	};
	
	// wrap tiles
	
	function wrapWithTile() {
	  
		var tile_width  = $('.tileItem').outerWidth(true);
		var tile_height = $('.tileItem').outerHeight(true);
		
		if(options.tileCountPerColumn == 0) {
		  options.tileCountPerColumn = Math.floor((window_height - options.gridWidthOffset)/tile_height);
		}
		
		var lis = fixDanglingTilesAndGetList();
		
    for(var i = 0; i < lis.length; i+=options.tileCountPerColumn) {
      var list = lis.slice(i, i+options.tileCountPerColumn)
			lis.slice(i, i+options.tileCountPerColumn)
      	.wrapAll("<div class='tile'></div>");
    };
		
		$('.tile').css('width', tile_width);
		gridWidth = $('.tile').length * (tile_width + options.gridWidthOffset);
		
		main.css('width', gridWidth + 'px');
	};
	
	function fixDanglingTilesAndGetList() {
	  var list = $('.tileItem').filter(':not(.tile .tileItem)');
	  var lastTile        = $('.tile').last();
	  var tileItemsLength = $(lastTile).children('.tileItem').length;
	  if (tileItemsLength < options.tileCountPerColumn) {
	    var remainingTiles = options.tileCountPerColumn - tileItemsLength; 
	    for (var i=0; i < remainingTiles; i++) {
	      var item = $(list)[i];
	      //alert(item);
	      $(lastTile).append($(item));
	      $(list).splice(i, 1);
	    };
	  }
	  
	  return list;
	};
	
	return createGridLayout();
};