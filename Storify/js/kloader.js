function loadPages() {
	if((window.pageXOffset + window.innerWidth) > ($("#kui-grid-view").width() * 0.8)) {
		newPageLoad = true;
	}
	
	noOfPagesLoaded++;
	if (newPageLoad && noOfPagesLoaded <= noOfPagesToLoad) {
		var head 		= document.getElementsByTagName('head')[0];
		var script 	= document.createElement('script');
		script.type	= 'text/javascript';
		script.src	= request_url;
		head.appendChild(script);
	}
	else {
		clearLoadInterval();
	}
	
	if (needAutoScroll == true)
		setTimeout("loadPages()", 1000);
};

function setLoadInterval() {
	noOfPagesLoaded = 0;
	loadInterval = setInterval("loadPages()", 1000);
}

function clearLoadInterval() {
	newPageLoad = false;
	noOfPagesLoaded = 0;
	clearInterval(loadInterval);
}