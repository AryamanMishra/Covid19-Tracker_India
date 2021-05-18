
let statesData = {};

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

const fetch_allStatesData = async function() {
	const getstates = await axios.get('https://api.covid19india.org/state_district_wise.json');
	statesData = getstates.data;
	//console.log(statesData);
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
message();
fetch_allStatesData();
fetch_activeData();
fetch_deceasedData();
fetch_recoveredData();
