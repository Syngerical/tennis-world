//	api key for sportradar
var API_KEY = "";
//	fields we will be monitoring and displaying in the table
var fields = ["Rank", "Player", "Circuit Points", "Nationality"];
var tableSize = 15;
//	default selection
var	currentSelection = "Mens";

function getData(selection){
	var selectionDict = {"Mens" : 1, "Womens" : 0};
	var allPlayersJSON = getPlayersJSON();
	//	get actual rankings, .rankings has array of length 2, first element for womens, second element for mens
	var mensRankings = allPlayersJSON.rankings[selectionDict[selection]].player_rankings;
	//	empty array to begin with. will be an array of dicts, each dict has info for each field in the table
	var data = [];
	//	puts dictionary info into data array
	for(var rowIndex = 0; rowIndex < tableSize; rowIndex++){
		var rowDict = {};
		rowDict["Rank"] = mensRankings[rowIndex].rank;
		rowDict["Player"] = mensRankings[rowIndex].player.name;
		rowDict["Circuit Points"] = mensRankings[rowIndex].points;
		rowDict["Nationality"] = mensRankings[rowIndex].player.nationality;
		data.push(rowDict);
	}
	return data;
}

function generateTable(selection){
	//	set current selection variable for the sizeEntry form to use
	currentSelection = selection;
	//	gets the data
	var data = getData(selection);
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
	for(var index = 0; index < tableSize; index++){
		var row = document.createElement("tr");
		//	puts data into each cell for this specific row
		for(var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++){
			var rowElement = document.createElement("td");
			var thing = fields[fieldIndex];
			rowElement.append(document.createTextNode(data[index][thing]));
			row.appendChild(rowElement);
		}
		table.appendChild(row);
	}

	//	clears the rank_table first so previous stuff doesn't show up again, prevents multiple tables
	document.getElementById("rank_table").innerHTML="";
	//	add the ordered list to the div element in html
	document.getElementById("rank_table").appendChild(table);
	createSizeEntry();
}

function createSizeEntry(){
	var sizeEntry = document.createElement("form");
	sizeEntry.setAttribute("action", "javascript:setSize(document.getElementById('sizeForm').value);");
	var input = document.createElement("input");
	input.setAttribute("id", "sizeForm");
	input.setAttribute("type", "text");
	input.setAttribute("placeholder", "Table Size");
	sizeEntry.appendChild(input);
	document.getElementById("rank_table").appendChild(sizeEntry);

	/*<form action="javascript:setSize(document.getElementById('sizeForm').value);">
		<input id="sizeForm" type="text" placeholder="Table Size"/>
	</form>*/
}

function setSize(size){
	if(size >= 1){
		tableSize = size;
		generateTable(currentSelection);
	}
	else{
		document.getElementById("sizeForm").value = "Invalid size";
	}
}

function getPlayersJSON(){
	//	making http request to get data from api
	var httpRequest = new XMLHttpRequest();
	var api = "https://api.sportradar.com/tennis-t2/en/players/rankings.json?api_key=" + API_KEY;
	httpRequest.open("GET", api, false);
	httpRequest.send();
	var parsed_json = JSON.parse(httpRequest.responseText);
	return parsed_json;
}