import fetch_weather_from_api from "../utils/weather_helpers";

const weather_api_service = async (city: string, date: string) => {
  return fetch_weather_from_api(city, date);
};

export default {
  weather_api_service,
};
