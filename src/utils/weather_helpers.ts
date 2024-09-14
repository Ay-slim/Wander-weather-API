import axios from "axios";
import { ValidatedApiResponseType, WeatherApiResponseType } from "./types";
import { ErrorResponse } from "./error_response";
import { API_URL, CUSTOM_ERROR_PREFIX } from "./constants";

export const farhenheit_to_celsius = (fahrenheit: number): number => {
  return ((fahrenheit - 32) * 5) / 9;
};

export const celsius_to_fahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

export const convert_temperature_units = (
  api_response: WeatherApiResponseType,
): ValidatedApiResponseType => {
  const currentUnit = Object.keys(api_response)?.[0];
  if (currentUnit === "celcius") {
    return {
      ...api_response,
      fahrenheit: celsius_to_fahrenheit(api_response.celcius),
    };
  }
  return {
    ...api_response,
    celcius: farhenheit_to_celsius(api_response.fahrenheit),
  };
};

const fetch_weather_from_api = async (city: string, date: string) => {
  try {
    const response = await axios.post(API_URL, {
      city,
      date,
    });
    if (response.status === 200) {
      return convert_temperature_units(response.data);
    }
    throw response.data;
  } catch (err) {
    throw new ErrorResponse(
      `${CUSTOM_ERROR_PREFIX}Our providers are down at the moment. Please try again later`,
      500,
      err,
    );
  }
};

export default fetch_weather_from_api;
