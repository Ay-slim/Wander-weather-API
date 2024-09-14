import { DATABASE_ERROR } from "../utils/constants";
import { ValidatedApiResponseType } from "../utils/types";
import fetch_weather_from_api from "../utils/weather_helpers";
import {
  cacheTemperature,
  deleteExpiredCache,
  fetchCachedTemperature,
} from "./cache";

const weather_api_service = async (
  city: string,
  date: string,
  cache_expiry: number,
) => {
  const cached_data = await fetchCachedTemperature(city, date).catch((err) =>
    console.log(`${DATABASE_ERROR} cache fetch ==> ${err}`),
  );
  if (cached_data) {
    const cache_age = new Date().getTime() - cached_data.cache_time;
    if (cache_age < cache_expiry) {
      const { temperature } = cached_data;
      const { fahrenheit, celcius }: ValidatedApiResponseType =
        JSON.parse(temperature);
      return {
        celcius: celcius.toFixed(2),
        fahrenheit: fahrenheit.toFixed(2),
      };
    }
    await deleteExpiredCache(city, date, cached_data.cache_time).catch((err) =>
      console.log(`${DATABASE_ERROR} cache delete ==> ${err}`),
    );
  }
  const live_temperature = await fetch_weather_from_api(city, date);
  cacheTemperature(city, date, live_temperature).catch((err) =>
    console.log(`${DATABASE_ERROR} cache write ==> ${err}`),
  );
  return {
    celcius: live_temperature.celcius.toFixed(2),
    fahrenheit: live_temperature.fahrenheit.toFixed(2),
  };
};

export default {
  weather_api_service,
};
