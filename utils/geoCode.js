const axios = require('axios');

const getCoordinatesFromPincode = async (pincode, apiKey) => {
  const url = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${pincode}&countrycodes=IN&format=json`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.length > 0) {
      const location = {
        lat: data[0].lat,
        lon: data[0].lon
      };
      return location;
    } else {
      // throw new Error('No results found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    return null;
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
  
module.exports = {getCoordinatesFromPincode, getAddressFromLatLng};      