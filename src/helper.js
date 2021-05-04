// Data list to store data
var dataList = [];

// Parse data from API
function parseData(entries) {
    // Reset data list
    dataList.length = 0;

    // Get entry from entries
    entries.forEach((value) => {
        var entry = {
            'day': value.gsx$ngày.$t.replace(/\s+/g, ''),
            'month': value.gsx$tháng.$t.replace(/\s+/g, ''),
            'year': value.gsx$tấtcảnămsinh.$t.split('-'),
            'money': value.gsx$mệnhgiá.$t.replace(/[a-zA-Z]|\s+/g, ''),
            'seri': value.gsx$kítự.$t.replace(/\s+/g, ''),
        }
        // Push entry into the data list
        dataList.push(entry);
    })
}

// Parse other data from API
function parseOtherData(entries) {
    // Get other entry from entries
    entries.forEach((value) => {
        let day = value.gsx$ngày.$t.replace(/\s+/g, '');
        let year = [];

        for (const property in value) {
            // Get value of years
            if (property.includes('gsx$_')) {
                // Define years are 2k or 19xx and push to array
                if (parseInt(value[property].$t) < 51) {
                    year.push(parseInt(value[property].$t) + 2000);
                }
                else {
                    year.push(parseInt(value[property].$t) + 1900);
                }
            }
        }

        var otherEntry = {
            'day': day.substring(0, 2),
            'month': day.charAt(day.length - 1),
            'year': year,
            'money': value.gsx$mg.$t.replace(/[a-zA-Z]|\s+/g, ''),
            'seri': value.gsx$kýtự.$t.replace(/\s+/g, ''),
        }
        
        // Push entry into the data list
        dataList.push(otherEntry);
    })
}

export {
    dataList, parseData, parseOtherData
}