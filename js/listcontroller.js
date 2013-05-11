/**
 * listcontroller.js manages the list of local volunteering opportunities
 *
 * It uses jQuery, mustache.js for templating
 * and the facebook SDK.
 *
 * @author	Rob Finean <rfinean@iee.org>
 *
 * @version 0.4   facebook
 * @version	0.3		mustache template and import.io federated search 
 */

	// Init the client lib with auth credentials 
/*	importio.init({"auth": {
		"userGuid": "0427bf4e-87a8-4fcf-be63-4934774fff6f",
		"apiKey": ""
	}});
*/
	var searchLoc = document.getElementById('searchloc');
  var spinner = document.getElementById('loading').style;
  var template = document.getElementById('opplisting').innerHTML;
	var list = $('#opplist');
	var geoLoc = null;

	function oppSearch() {
		var location = "EC2A 4BX";
		console.log("Searching for", location);
		// Build the query object 
		var query = {
			"input": {
				"location": location
			},
			"requestId": "testquery",
			"mixGuids": ["a5ccc93f-fc44-4822-8554-50da02346fda"]
		};


		// Do the query 
		spinner.display = 'inline';
		importio.query(query).data(showList).done(function() {
			spinner.display = 'none';
		});

		return false;
	}

	// Helper functions to take opportunities and render them for us
	function showList(d) {
//		console.log("list retrieved: ", d);
		list.empty();
		d.map(showListing);
	}

	function showListing(item) {
		var output = Mustache.render(template, item);
		list.append(output);
	}


	// Populate the list with cached 'last location' data whilst waiting
	$.getJSON('js/placeholder.json', showList);
  spinner.display = 'none';


	// Check to see if this browser supports geolocation.
	if (navigator.geolocation) {
		// Get the location of the user's browser using the
		// native geolocation service.
		// only the first callback is requied. The second
		// callback - the error handler - and the third
		// argument - our configuration options - are optional.
		navigator.geolocation.getCurrentPosition(
			function(position) {
				// Check to see if there is already a verified location.
				// There is a bug in FireFox where this gets
				// invoked more than once with a cahced result.
				if (geoLoc) return;
				// Log that this is the initial position.
				console.log("Initial Position Found:", position.coords);
				// Add a marker to the map using the position.
				geoLoc = position.coords;
//				$.getJSON()
			},
			function(error) {
				console.log( "geoLocation went wrong:", error );
			},
			{
				timeout: (5000),
				maximumAge: (1000 * 60 * 15),
				enableHighAccuracy: false
			}
		);
	}
