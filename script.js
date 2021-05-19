/*

A live tracker for covid-19 displaying stats with table data and graphs

Developer - Aryaman Mishra
Mail - aryaman.m09@gmail.com
Linkedin - https://www.linkedin.com/in/aryaman-mishra-576527190/
Any feedback for adding new things or improval of the existing things would be highly appreciable  

*/


let statesData = {}; // Object to store state names as key and there data as value
let state_actives = []; // Array to store active count for each state alphabetically
let state_deceased = []; // Array to store death count for each state alphabetically
let state_recovered = []; // Array to store recovery count for each state alphabetically
let statesnames_withactives = {}; // Object to store state name as key and their active count as value
let statesnames_withdeceased = {}; // Object to store state name as key and their death count as value
let statesnames_withrecovered = {}; // Object to store state name as key and their recovered count as value

// const test = async function() {
// 	const testing = await axios.get('https://api.covid19india.org/state_district_wise.json');
// 	const statestest = testing.data;
// 	console.log(statestest);
// }


function message() {
	alert('Stay Home Stay Safe'); // A safety appeal
}


// Basically a method to format numbers in Indian style(lakhs,crores)
function format(s) { 
	if (s.length < 5)
		return s;
	else if (s.length == 5)
		return s.substring(0,2) + ',' + s.substring(2);
	else if (s.length == 6)
		return s.substring(0,1) + ',' + s.substring(1,3) + ',' + s.substring(3);
	else if (s.length == 7)
		return s.substring(0,2) + ',' + s.substring(2,4) + ',' + s.substring(4);
}


// A function to sort an object
function sortObject(object) { 
	const sortable = Object.entries(object)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
	return sortable;
}


// A method to fetch all states data as an object
const fetch_allStatesData = async function() { 
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
}


/* A method to iterate through every state data and get active cases in each district
and add them up to make state total active data*/
const fetch_activeData = async function() { 
    try {
        let config = {headers: {Accept: 'application/json'}}
        const res = await axios.get('https://api.covid19india.org/state_district_wise.json',config);
		for (state in statesData) {
			let actives = 0;
			if (state != 'State Unassigned') {
				let districts = res.data[state].districtData;
				for (const district in districts) {
					actives += districts[district]["active"];
				}
				state_actives.push(actives);
				actives = actives.toString();
				document.getElementById(`${state}_Active`).innerText = format(actives);
			}
		}
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}


/* A method to iterate through every state data and get death cases in each district
and add them up to make state total death data*/
const fetch_deceasedData = async function() {
    try {
        let config = {headers: {Accept: 'application/json'}}
        const res = await axios.get('https://api.covid19india.org/state_district_wise.json',config);
        for (state in statesData) {
			let deaths = 0;
			if (state != 'State Unassigned') {
				let districts = res.data[state].districtData;
				for (const district in districts) {
					deaths += districts[district]["deceased"];
				}
				deaths = deaths.toString();
				state_deceased.push(deaths);
				document.getElementById(`${state}_Deaths`).innerText = format(deaths);
			}
		}
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}


/* A method to iterate through every state data and get recovered count in each district
 and add them up to make state total recovery data*/
const fetch_recoveredData = async function() {
    try {
        let config = {headers: {Accept: 'application/json'}}
        const res = await axios.get('https://api.covid19india.org/state_district_wise.json',config);
        for (state in statesData) {
			let recoveries = 0;
			if (state != 'State Unassigned') {
				let districts = res.data[state].districtData;
				for (const district in districts) {
					recoveries += districts[district]["recovered"];
				}
				state_recovered.push(recoveries);
				recoveries = recoveries.toString();
				document.getElementById(`${state}_Recovered`).innerText = format(recoveries);
			}
		}
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}

//test();
//message();

// Calling all the above methods
// Every method is async await to get synchronised data
fetch_allStatesData();
fetch_activeData();
fetch_deceasedData();
fetch_recoveredData();


let state_names = []; // A array to store state names


/* A method to create an object in which state name is key and active data is value
in order to graph them later on*/
const actives_graphData = async function() {
	let newData = 0;
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
	for (let name in statesData) {
		state_names.push(name);
	}
	state_names.shift(); // Popping out the 'State Unassiged' key
	for (let name = 0;name<state_names.length;name++) {
		for (let data=newData;data<state_actives.length;data++) {
			statesnames_withactives[state_names[name]] = state_actives[data];
			++data;
			newData = data;
			break;
		}
	}
	statesnames_withactives = sortObject(statesnames_withactives); // Sorting the object in inc. order
	return (statesnames_withactives);
}


// Calling this method now to fill statesames_withactives with proper data
actives_graphData();

// Google charts loader
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(actives_graph);


// A method to graph the 5 states with most number of active cases
function actives_graph() {
	let data = null;
	let c = 0,b = 0;
	let arr = [];
	let brr = [];
	for (actives in statesnames_withactives) {
		++c;
		if (c > 31) {    // Pushing the last 5 elements only as they have the higest values
			arr.push(statesnames_withactives[actives]);
		}
	}
	for (names in statesnames_withactives) {
		++b;
		if (b > 31) {
			brr.push(names);
		}
	}
	data = new google.visualization.DataTable();
	data.addColumn('string', 'States');
	data.addColumn('number', 'Cases');
	data.addColumn({type:'string', role:'style'});
	data.addRows([
  		[`${brr[4]}`, Number(arr[4]),'red'],
		[`${brr[3]}`, Number(arr[3]),'green'],
		[`${brr[2]}`, Number(arr[2]),'gold'],
		[`${brr[1]}`, Number(arr[1]),'cyan'],
		[`${brr[0]}`, Number(arr[0]),'white'],
	]);
	let options = {
		is3D: true,
		titleTextStyle: {
			color: "white",
			bold: "true",
			underline:"true"
		  },
		vAxis: {
			textStyle: {
				color: "white",
				bold: "true",
				underline:"true"
			}
		},
		hAxis: {
			textStyle: {
				color: "white",
				bold: "true",
				underline:"true"
			}
		},
		title: "Top 5 states with most number of active cases:-",
        width: 1505,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
		backgroundColor:'rgb(3, 19, 30)'  // The global bg color
	}
	let chart = new google.visualization.BarChart(document.getElementById("graph_actives")); // DOM element
	chart.draw(data,options);
}


const deceased_graphData = async function() {
	let newData = 0;
	let state_names_1 = [];
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
	for (let name in statesData) {
		state_names_1.push(name);
	}
	state_names_1.shift(); // Popping out the 'State Unassiged' key
	for (let name = 0;name<state_names.length;name++) {
		for (let data=newData;data<state_deceased.length;data++) {
			statesnames_withdeceased[state_names_1[name]] = state_deceased[data];
			++data;
			newData = data;
			break;
		}
	}
	
	statesnames_withdeceased = sortObject(statesnames_withdeceased); // Sorting the object in inc. order
	return (statesnames_withdeceased);
}
deceased_graphData();


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(deceased_graph);

function deceased_graph() {
	let data = null;
	let c = 0,b = 0;
	let arr = [];
	let brr = [];
	for (deceased in statesnames_withdeceased) {
		++c;
		if (c > 31) {    // Pushing the last 5 elements only as they have the higest values
			arr.push(statesnames_withdeceased[deceased]);
		}
	}
	for (names in statesnames_withdeceased) {
		++b;
		if (b > 31) {
			brr.push(names);
		}
	}
	data = new google.visualization.DataTable();
	data.addColumn('string', 'States');
	data.addColumn('number', 'Death');
	data.addColumn({type:'string', role:'style'});
	data.addRows([
		[`${brr[4]}`, Number(arr[4]),'red'],
	  	[`${brr[3]}`, Number(arr[3]),'green'],
	  	[`${brr[2]}`, Number(arr[2]),'gold'],
	  	[`${brr[1]}`, Number(arr[1]),'cyan'],
		[`${brr[0]}`, Number(arr[0]),'white'],
  	]);
	let options = {
		titleTextStyle: {
			color: "white",
			bold: "true",
			underline:"true"
		},
		vAxis: {
			textStyle: {
				color: "white",
				bold: "true",
				underline:"true"
			}
		},
		hAxis: {
			textStyle: {
				color: "white",
				bold: "true",
				underline:"true"
			}
		},
		title: "Top 5 states with most number of deaths:-",
		width: 1505,
		height: 400,
		bar: {groupWidth: "95%"},
		legend: { position: "none" },
		backgroundColor:'rgb(3, 19, 30)'  // The global bg color
	}
	let chart = new google.visualization.BarChart(document.getElementById("graph_deceased")); // DOM element
	chart.draw(data,options);	
}


const recovered_graphData = async function() {
	let newData = 0;
	let state_names_2 = [];
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
	for (let name in statesData) {
		state_names_2.push(name);
	}
	state_names_2.shift(); // Popping out the 'State Unassiged' key
	for (let name = 0;name<state_names_2.length;name++) {
		for (let data=newData;data<state_recovered.length;data++) {
			statesnames_withrecovered[state_names_2[name]] = state_recovered[data];
			++data;
			newData = data;
			break;
		}
	}
	
	statesnames_withrecovered = sortObject(statesnames_withrecovered); // Sorting the object in inc. order
	return (statesnames_withrecovered);
}
recovered_graphData();


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(recovered_graph);

function recovered_graph() {
	let data = null;
	let c = 0,b = 0;
	let arr = [];
	let brr = [];
	for (recovered in statesnames_withrecovered) {
		++c;
		if (c > 31) {    // Pushing the last 5 elements only as they have the higest values
			arr.push(statesnames_withrecovered[recovered]);
		}
	}
	for (names in statesnames_withrecovered) {
		++b;
		if (b > 31) {
			brr.push(names);
		}
	}
	data = new google.visualization.DataTable();
	data.addColumn('string', 'States');
	data.addColumn('number', 'Recoveries');
	data.addColumn({type:'string', role:'style'});
	data.addRows([
		[`${brr[4]}`, Number(arr[4]),'cyan'],
	  	[`${brr[3]}`, Number(arr[3]),'blue'],
	  	[`${brr[2]}`, Number(arr[2]),'gold'],
		[`${brr[1]}`, Number(arr[1]),'green'],
	  	[`${brr[0]}`, Number(arr[0]),'red'],
  	]);
	let options = {
		titleTextStyle: {
			color: "white",
			bold: "true",
			underline:"true"
		},
		vAxis: {
			textStyle: {
				color: "white",
				bold: "true",
				underline:"true"
			}
		},
		hAxis: {
			textStyle: {
				color: "white",
				bold: "true",
				underline:"true"
			}
		},
		title: "Top 5 states with most number of recoveries:-",
		width: 1505,
		height: 400,
		bar: {groupWidth: "95%"},
		legend: { position: "none" },
		backgroundColor:'rgb(3, 19, 30)'  // The global bg color
	}
	let chart = new google.visualization.BarChart(document.getElementById("graph_recovered")); // DOM element
	chart.draw(data,options);	
}