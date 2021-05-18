
let statesData = {};
let state_actives = [];
let state_deceased = [];
let state_recovered = [];
let statesnames_withactives = {};
let statesnames_withdeceased = {};
let statesnames_withrecovered = {};

// const test = async function() {
// 	const testing = await axios.get('https://api.covid19india.org/state_district_wise.json');
// 	const statestest = testing.data;
// 	console.log(statestest);
// }


function message() {
	alert('Stay Home Stay Safe'); // A safety appeal
}

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

function sortObject(object) {
	const sortable = Object.entries(object)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
	return sortable;
}

const fetch_allStatesData = async function() {
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
}

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
fetch_allStatesData();
fetch_activeData();
fetch_deceasedData();
fetch_recoveredData();

let state_names = [];

const actives_graphData = async function() {
	let newData = 0;
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
	for (let name in statesData) {
		state_names.push(name);
	}
	state_names.shift();
	for (let name = 0;name<state_names.length;name++) {
		for (let data=newData;data<state_actives.length;data++) {
			statesnames_withactives[state_names[name]] = state_actives[data];
			++data;
			newData = data;
			break;
		}
	}
	statesnames_withactives = sortObject(statesnames_withactives);
	return (statesnames_withactives);
}

actives_graphData();

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(actives_graph);

function actives_graph() {
	let data = null;
	let c = 0,b = 0;
	let arr = [];
	let brr = [];
	for (actives in statesnames_withactives) {
		++c;
		if (c > 31) {
			arr.push(statesnames_withactives[actives]);
		}
	}
	for (names in statesnames_withactives) {
		++b;
		if (b > 31) {
			brr.push(names);
		}
	}
	data = google.visualization.arrayToDataTable([
        ["States", "Numbers", { role: "style" } ],
        [`${brr[0]}`, arr[0], "cyan;"],
        [`${brr[1]}`, arr[1], "blue"],
        [`${brr[2]}`, arr[2], "gold"],
        [`${brr[3]}`, arr[3], "green"],
		[`${brr[4]}`, arr[4], "red"]
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
		title: "Top 5 states with most number of active cases:-",
        width: 1505,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
		backgroundColor:'rgb(3, 19, 30)'
	}
	let chart = new google.visualization.BarChart(document.getElementById("graph_actives"));
	chart.draw(data,options);
}

