function instagramCallback2Index(data) {
	request_url = data.pagination.next_url + "&callback=instagramCallback2Index";
	items = [];
	$.each(data.data, function(index, item) {
		items.push(
								{caption: item.images.low_resolution.url, content: "<img src='" + item.images.thumbnail.url + "' />"}
							);
	});
	$('#kui-grid-view').gridfy({
		content_json: items,
		sizeOfGrid: {height: '160px', width: '160px'}
	});
};