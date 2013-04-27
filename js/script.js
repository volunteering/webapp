/**
 * script.js manages the list of local volunteering opportunities
 *
 * It uses jQuery, mustache.js for templating,
 * import.io APIs for federated search of multiple charities
 * and YQL for resolving geo-locations.
 *
 * @author	Rob Finean <rfinean@iee.org>
 *
 * @version	0.3		mustache template and import.io federated search 
 */

	// Init the client lib with auth credentials 
	importio.init({"auth": {
		"userGuid": "0427bf4e-87a8-4fcf-be63-4934774fff6f",
		"apiKey": ""
	}});

	var template = $('#opplisting').html();
	var list = $("#opplist");

	function go() {
		var location = "EC2A 4BX";
		console.log("Searching for", location);
		// Build the query object 
		var query = {
			"input": {
				"location": location
			},
			"requestId": "testquery",
			"mixGuids": ["a5ccc93f-fc44-4822-8554-50da02346fda"]
		}


		// Do the query 
		$("#loading").show();
		importio.query(query).data(showList).done(function() {
			$("#loading").hide();
		});
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

	$.getJSON('js/placeholder.json', showList)
