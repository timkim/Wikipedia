

function search() {
  if($('#search').hasClass('inProgress')) {
    window.frames[0].stop();
    $('#search').removeClass('inProgress');
    return;
  }
	if (hasNetworkConnection()) {
		var searchParam = $('#searchParam').val();
	
		if (searchParam == '') {
			hideOverlayDivs();
			return;
		}
		
    $('#search').addClass('inProgress');
		                   
		var requestUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&";
		requestUrl += "search=" + encodeURIComponent(searchParam) + "&";
		requestUrl += "format=json";

    cachedPages.get(searchParam,function(cache){
      if(cache==null|| cache.value==null){
        console.log('searchParam:' + searchParam +  ' not found');
        $.ajax({
          type:'Get',
          url:requestUrl,
          success:function(data) {
            theData = data;
            displayResults(data);
            cachedPages.save({key:searchParam, value: data});
            console.log('Saving searchParam:' + searchParam);
          }
        });
      }else{
        console.log('searchParam:' + searchParam + ' found');
        displayResults(cache.value);
      }
    });


	}else{
		noConnectionMsg();
		hideOverlayDivs();
	}
}

function displayResults(results) {
	var formattedResults = "";
	
	if (results != null) {
		results = eval(results);
	
		if (results.length > 0) {
			var searchParam = results[0];
			var searchResults = results[1];
		
			for (var i=0;i<searchResults.length;i++) {
				var article = searchResults[i];
				
				if (article.toLowerCase() == $('#searchParam').val().toLowerCase()) {
					goToResult(article);
					return;
				}
				
				formattedResults += "<div class='listItemContainer' onclick=\"javascript:goToResult(\'" + article + "\');\">";
				formattedResults += "<div class='listItem'>";
				formattedResults += "<span class='iconSearchResult'></span>";
				formattedResults += "<span class='text'>" + article + "</span>";
				formattedResults += "</div>";
				formattedResults += "</div>";
			}
		}
	}else{
		formattedResults += "nothingness...";
	}
	
	formattedResults += "<div class='listItemContainer' onclick='javascript:hideSearchResults();'>";
	formattedResults += "<div class='listItem'>Close</div>";
	formattedResults += "</div>";
	
	$('#resultList').html(formattedResults);
		
	hideOverlayDivs();

	$('#searchresults').show();
	$('#content').hide();
	
}

function goToResult(article) {
	if (hasNetworkConnection()) {
    $('#search').addClass('inProgress');
		var url = "http://en.wikipedia.org/wiki/" + article;	
		$('#main').attr('src', url);
		hideOverlayDivs();
		showContent();
	}else{
		noConnectionMsg();
	}
}

function hideSearchResults() {
	hideOverlayDivs();
	showContent();
}
