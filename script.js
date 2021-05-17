
let statesData = {};

// const test = async function() {
// 	const testing = await axios.get('https://api.covid19india.org/state_district_wise.json');
// 	const statestest = testing.data;
// 	console.log(statestest);
// }


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
				document.getElementById(`${state}_Active`).innerText = actives;
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
				document.getElementById(`${state}_Deaths`).innerText = deaths;
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
				document.getElementById(`${state}_Recovered`).innerText = recoveries;
			}
		}
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}


//test();
fetch_allStatesData();
fetch_activeData();
fetch_deceasedData();
fetch_recoveredData();