//	api key for sportradar
var API_KEY = "";
//	fields we will be monitoring and having as columns of the table
var fields = ["Tournament Name", "Start Date", "End Date"];
//	gets data from api and parses json, returns information in the variable "data"
function getData(){
	var fields = ["Tournament Name", "Start Date", "End Date"];
	var json = getTournamentJSON();
	//	parse through json to find tournament names and add them to array if they match the given search terms
	var data = [];
	var searchTerms = ["ATP", "Masters", "Open", "Wimbledon"];
	//	array of tournament names we have already recorded. difficult to check if key exists in nested objects for "data", so using this separate array
	var tournamentsUsed = [];
	for(var index = 0; index < json.sport_events.length; index++){
		//	dict containing info about one specific tournament to be added to the "data" array
		var rowDict = {};
		//	parsing part of json
		var tournamentData = json.sport_events[index];s
		var tournamentName = tournamentData.tournament.name;
		tournamentName = tournamentName.substring(0, tournamentName.indexOf(","));
		//	makes sure tournament name matches search terms
		if(containsTerms(tournamentName, searchTerms) && !tournamentsUsed.includes(tournamentName)){
			tournamentsUsed.push(tournamentName);
			rowDict["Tournament Name"] = tournamentName;
			rowDict["Start Date"] = tournamentData.season.start_date;
			rowDict["End Date"] = tournamentData.season.end_date;
			data.push(rowDict);
		}
	}
	return data;
}

function getTournamentJSON(){
	//	making http request to get data from api
	var httpRequest = new XMLHttpRequest();
	var api = "https://api.sportradar.com/tennis-t2/en/schedules/2018-08-17/schedule.json?api_key=" + API_KEY;
	httpRequest.open("GET", api, false);
	httpRequest.send();
	var json = JSON.parse(httpRequest.responseText);
	return json;
}

function containsTerms(word, searchTerms){
	//document.write("beginning of containsTerms method");
	for(var index = 0; index < searchTerms.length; index++){
		if(word.indexOf(searchTerms[index]) >= 0){
			//document.write("returning true in containsTerms method for word: " + word + " and term: " + searchTerms[index] + "<br>");
			return true;
		}
	}
	//document.write("returning false in containsTerms method");
	return false;
}

function createTable(){
	//	array of dicts containing the data we want in our table
	var data = getData();
	//	creates basic table
	var table = document.createElement("table");
	//	sets up header row for table
	var header = document.createElement("tr");
	for(var index = 0; index < fields.length; index++){
		var headerElement = document.createElement("th");
		headerElement.append(document.createTextNode(fields[index]));
		header.appendChild(headerElement);
	}
	table.appendChild(header);

	//	put actual data in the table now as rows
	for(var index = 0; index < data.length; index++){
		var row = document.createElement("tr");
		//	puts data into each cell for this specific row
		for(var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++){
			var rowElement = document.createElement("td");
			var field = fields[fieldIndex];
			//	creating hyperlink entry if tournament name
			if(field == "Tournament Name"){
				var link = document.createElement("a");
				link.setAttribute("href", "https://www.google.com/search?q=" + data[index][field]);
				link.setAttribute("target", "_blank");
				link.appendChild(document.createTextNode(data[index][field]));
				rowElement.appendChild(link);
			}
			//	otherwise normal case, just regular text
			else{
				rowElement.append(document.createTextNode(data[index][field]));
			}
			row.appendChild(rowElement);
		}
		table.appendChild(row);
	}

	//	clears the rank_table first so previous stuff doesn't show up again, prevents multiple tables
	document.getElementById("tournament_table").innerHTML="";
	//	add the ordered list to the div element in html
	document.getElementById("tournament_table").appendChild(table);
}