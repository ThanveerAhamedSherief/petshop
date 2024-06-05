const axios = require('axios');

const getLatLngFromPincode = async (pincode, apiKey) => {
  const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${pincode}&format=json`;

  try {
    console.log("pincode==>", pincode)
    const response = await axios.get(url);
    const data = response.data;


    if (data.length > 0) {
      const location = {
        lat: data[0].lat,
        lon: data[0].lon
      };
      return location;
    } else {
        return null
    }
  } catch (error) {
    console.error('Error fetching geolocation:', error.message);
  }
};

module.exports = {getLatLngFromPincode};