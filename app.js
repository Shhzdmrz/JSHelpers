var axios = require('axios');

checkStatus = (data) => {
  let status = false;
  switch (data.status) {
    case "OK":
      console.log('The address was successfully parsed.');
      status = true;
      break;
    case "ZERO_RESULTS":
      console.log('Geocode was successful but returned no results. As the geocoder was passed a non-existent address.');
      break;
    case "OVER_DAILY_LIMIT":
      console.log('API key is missing/invalid or Billing not enabled or Usage cap exceeded or Payment is no longer valid');
      break;
    case "OVER_QUERY_LIMIT":
      console.log('You are over your quota');
      break;
    case "REQUEST_DENIED":
      console.log('Your request was denied');
      break;
    case "INVALID_REQUEST":
      console.log('Query (address, components or latlng) is missing');
      break;
    case "UNKNOWN_ERROR":
      console.log('Request could not be processed due to a server error');
      break;
    default:
      console.log('Undefined error occured.')
      break;
  }

  return status;
}

getInfoFromStreetAddress = (addressComponents) => {
  for (let k = 0; k < addressComponents.length; k++) {
    let subTypes = addressComponents[k].types;
    for (let l = 0; l < subTypes.length; l++) {
      if (subTypes[l] === 'sublocality_level_1') {
        console.log('Area: ', addressComponents[k].long_name);
      }

      if (subTypes[l] === 'locality') {
        console.log('City: ', addressComponents[k].long_name);
      }

      if (subTypes[l] === 'administrative_area_level_1') {
        console.log('Province: ', addressComponents[k].long_name);
      }

      if (subTypes[l] === 'country') {
        console.log('Country: ', addressComponents[k].long_name);
      }
    }
  }
}

getInfoFromSublocality = (addressComponents) => {
  for (let k = 0; k < addressComponents.length; k++) {
    let subTypes = addressComponents[k].types;
    for (let l = 0; l < subTypes.length; l++) {
      if (subTypes[l] === 'sublocality') {
        console.log('Area: ', addressComponents[k].long_name);
      }

      if (subTypes[l] === 'locality') {
        console.log('City: ', addressComponents[k].long_name);
      }

      if (subTypes[l] === 'administrative_area_level_1') {
        console.log('Province: ', addressComponents[k].long_name);
      }

      if (subTypes[l] === 'country') {
        console.log('Country: ', addressComponents[k].long_name);
      }
    }
  }
}

let googleMapUrl = 'https://maps.googleapis.com/maps/api/geocode/json?';
// let param = '30.162332,71.496860'; //Multan
let param = '24.487989,54.395085';//BBIS
// let param = '24.495960, 54.407742';//Sham Abu Dhabi
// let param = '24.489205, 54.371279';//Abu Dhabi City
// let param = '30.194846, 71.468969';//Multan inner city
// let param = '30.233913, 71.472326';//North gulghast colony
// let param = '30.224337, 71.474840';//Gulghast Colony
let apiKey = 'AIzaSyCGO2ORkn1GJgPIZBcT1HuOQ-r7bu9ZMD8';

getGeocodingData = async () => {
  try {
    var response = await axios.get(`${googleMapUrl}latlng=${param}&key=${apiKey}`);
    let geoData = response.data

    if (checkStatus(geoData)) {
      const { results } = geoData;
      if (results.length > 0) {
        let i = 0;
        do {
          const { types } = results[i];
          if (types.length > 0) {
            let j = 0;
            do {
              if (types[j] === 'street_address') {
                getInfoFromStreetAddress(results[i].address_components);
                break;
              } else if (types[j] === 'sublocality') {
                getInfoFromSublocality(results[i].address_components);
                break;
              }
              j++;
            } while (j < types.length);
          }
          i++;
        }
        while (i < results.length);
      } else {
        console.log('results are empty');
      }
    } else {
      console.log('data not avaialble');
    }
  } catch (err) {
    console.log('Error while getting the response from google api', err);
  }
}

getGeocodingData();








