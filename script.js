const fetch_activeData = async function(state) {
    try {
        let config = {headers: {Accept: 'application/json'}}
        const res = await axios.get('https://api.covid19india.org/state_district_wise.json',config);
        let actives = 0;
        let districts = res.data[state].districtData;
        for (const district in districts) {
            actives += districts[district]["active"];
        }
        document.getElementById('MP_Active').innerText = actives;
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}

const fetch_deceasedData = async function(state) {
    try {
        let config = {headers: {Accept: 'application/json'}}
        const res = await axios.get('https://api.covid19india.org/state_district_wise.json',config);
        let deaths = 0;
        let districts = res.data[state].districtData;
        for (const district in districts) {
            deaths += districts[district]["deceased"];
        }
        document.getElementById('MP_Deaths').innerText = deaths;
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}

const fetch_recoveredData = async function(state) {
    try {
        let config = {headers: {Accept: 'application/json'}}
        const res = await axios.get('https://api.covid19india.org/state_district_wise.json',config);
        let recoveries = 0;
        let districts = res.data[state].districtData;
        for (const district in districts) {
            recoveries += districts[district]["recovered"];
        }
        document.getElementById('MP_Recovered').innerText = recoveries;
    }
    catch(err) {
        console.log('Error in loading',err);
    }
}
fetch_activeData("Madhya Pradesh");
fetch_deceasedData("Madhya Pradesh");
fetch_recoveredData("Madhya Pradesh");