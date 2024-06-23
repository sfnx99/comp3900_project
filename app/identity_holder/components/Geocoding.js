import axios from 'axios';

const GEOCODING_API_KEY = 'AIzaSyCiaz5vtIZLFevcv6vQinymkkuF1zNYEb4';

export const getCoordinates = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GEOCODING_API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      console.error('Geocoding API error:', response.data.status);
      return null;
    }
  } catch (error) {
    console.error('Geocoding API error:', error);
    return null;
  }
};
