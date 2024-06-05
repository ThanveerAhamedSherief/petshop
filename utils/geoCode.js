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

const getAddressFromLatLng = async (lat, lng, apiKey) => {
    const url = `https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`;
  
    try {
      const response = await axios.get(url);
      const data = response.data;
  
      if (data) {
        return data;
      } else {
        return null;
        // throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error fetching address:', error.message);
      return null;
    }
  };
  
module.exports = {getLatLngFromPincode, getAddressFromLatLng};      