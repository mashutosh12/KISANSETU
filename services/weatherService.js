import axios from 'axios';

// OpenWeather API configuration
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = process.env.OPENWEATHER_BASE_URL;

/**
 * Get current season based on location using OpenWeather API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} - Season name (spring, summer, fall, winter)
 */
const getCurrentSeason = async (lat, lon) => {
  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    const temp = response.data.main.temp;
    const month = new Date().getMonth() + 1; // JavaScript months are 0-indexed

    // Determine season based on temperature and month
    // Northern hemisphere seasons
    if ((month >= 3 && month <= 5) || (temp >= 15 && temp <= 25)) {
      return 'spring';
    } else if ((month >= 6 && month <= 8) || (temp > 25)) {
      return 'summer';
    } else if ((month >= 9 && month <= 11) || (temp >= 10 && temp <= 15)) {
      return 'fall';
    } else {
      return 'winter';
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // Default to current month-based season if API fails
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'fall';
    return 'winter';
  }
};

export { getCurrentSeason };