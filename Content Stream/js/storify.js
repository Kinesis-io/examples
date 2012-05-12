function storifyCallback2Show(data) {
	var html = "<div class='story'>";
	var counter = 0;
	$.each(data.content.elements, function(index, element) {
		if (counter <= 6) {
			// add user avatar
			html += "<div class='element'>";
	
			var data = element.data;
			if (data.text) {
				html += "<div class='quote'>" + data.text + "</div>";
				counter++;
			}
			else if (data.quote) {
				html += "<div class='quote'>"
					html += "<div class='usertext'>" + data.quote.text + "</div>";
					html += "<div class='info'>"
						html += "<div class='source " + element.source.name + "'><span>" + element.posted_at + "</span></div>";
						html += "<div class='username'><span>" + data.quote.username + "</span><img class='avatar' src='" + element.attribution.thumbnail + "' />" + "</div>";
					html += "</div>";
				html += "</div>";
			}
			else if (data.image) {
				html += "<div class='imageHolder'><img class='image' src='" + data.image.src + "' /><div class='caption'>" + data.image.caption + "</div></div>";
				counter++;
			}
			html += "</div>";
		}
	});
	html += "</div>";
	
	$("#kui-grid-view").html(html);
	contentLoaded = true;
};

function turnToFlowing() {
	if (contentLoaded) {
		$('#kui-grid-view').columnize({
			width : 600,
			height : 500
		});
		// find first tile and make it active
	  var _first = $(".gridHolder .column")[0];
	  $(_first).addClass('active');
		contentLoaded = false;
		clearInterval(turnInterval);
	}
}