var infowindow = null;
var allMarkers = [];

var savedSearch = new Firebase("https://withinreach.firebaseio.com/");

function initialSearch(keywords, home) {
	var searchLocation = "&l="+home;
	var searchKeyword = "&q="+keywords;
	var limit = "&limit=";
	var resultsnum = 10;
	var pageNumber = 1;
	var first = true;

	buildResults(searchKeyword,searchLocation,limit,resultsnum,pageNumber,first,home);
}

function buildResults(searchKeyword,searchLocation,limit,resultsnum,pageNumber,first,home){

	var searchKey =searchKeyword;
	var searchLoc = searchLocation;
	var lim = limit;
	var resultsNumber = resultsnum;
	var pagenum = pageNumber;
	var initialSearch = first;
	var center = home;

	var queryURL = "//api.indeed.com/ads/apisearch?publisher=8023780673544955&format=json"+searchKey+searchLoc+lim+resultsNumber+"&v=2";

	$.ajax({
		url: queryURL,
		method: 'GET',
	    crossDomain: true,
	    dataType: 'jsonp'
	})
	.done(function(response) {

		var results = response.results
		var numResults = response.totalResults;

		for (var i = 0; i < results.length; i++) {

			var jobTitle = results[i].jobtitle;
			var company = results[i].company;
			var location = results[i].formattedLocationFull;
			var snippet = results[i].snippet;
			var link = results[i].url;
			var jobKey = results[i].jobkey;

			// $("#resultsList").append(string);
			$("#resultsList").append("<a href="+link+" target=\"_blank\" ><div class=\"searchResult\" id="+jobKey+"><h2>" + jobTitle + "</h2><p>" + company + " - " + location + "</p><p>" + snippet + "</p></div></a>");
			$("#resultsList").append("<div class=\"searchResult\" id="+jobKey+"><a href="+link+" target=\"_blank\" ><h2>" + jobTitle + "</h2><p>" + company + " - " + location + "</p><p>" + snippet + "</p></a></div>");
		
		}
		if ( Math.ceil(numResults / 10) > pagenum ){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"nextPage\">Next 10 <span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span></button>");
			$('#nextPage').click(function(){
				//initMap();
				
				if (initialSearch) {
					var start = '&start=';
					initialSearch = false;
					pagenum++;
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,initialSearch,center);
				} else {
					var start = '&start=';
					pagenum++;
					resultsNumber = resultsNumber + 10;
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,initialSearch,center);				
				}
			});
		}

		if ( pagenum > 1 ){
			$("#resultsList").append("<button type=\"button\" class=\"btn btn-default center-block\" id=\"previousPage\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span> Previous 10</button>");
			$('#previousPage').click(function(){
				//initMap();
				getCenter(center);
				if (pagenum == 2) {
					var limit = "&limit=";
					first = true;
					resultsNumber = 10;
					pagenum--;
					buildResults(searchKey,searchLoc,limit,resultsNumber,pagenum,first,center);
				} else {
					var start = '&start=';
					pagenum--;
					resultsNumber = resultsNumber - 10;
					buildResults(searchKey,searchLoc,start,resultsNumber,pagenum,first,center);				
				}
			});	
		}

	});
}

$('#seeResults').click(function(){
	var keywords = $('#keywords').val().trim();
	var home = $('#location').val().trim();

	if (home !== ''){
		initialSearch(keywords, home);
		$('#keywords').val('');
		$('#location').val('');
		// $('.navbar').show();
		$('.results').show();
		$('#search').hide();
		$('#map2').hide();
	} else {
		$('#myModal').modal('show');
	}

	return false;
});

$('#seeResultsNav').click(function(){
	
	var keywords = $('#keywordsNav').val().trim();
	var home = $('#locationNav').val().trim();

	if (home !== ''){
		initialSearch(keywords, home);
		$('#keywords').val('');
		$('#location').val('');
	} else {
		$('#myModal').modal('show');
	}

	return false;

});

$('#currentLocNav').click(function(){
	
	var startPos;
	var geoOptions = {
		maximumAge: 5 * 60 * 1000,
		timeout: 10 * 1000,
	}

});
