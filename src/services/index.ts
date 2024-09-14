import axios from "axios";
import ErrorResponse from "../utils/ErrorResponse";

export const farhenheitToCelsius = (fahrenheit: number): number => {
  return ((fahrenheit - 32) * 5) / 9;
};

export const celsiusToFahrenheit = (celsius: number): number => {
  return (celsius * 9) / 5 + 32;
};

type WeatherApiResponseType = {
  [key in "celcius" | "fahrenheit"]: number;
};
type ValidatedApiResponseType = {
  celcius: number;
  fahrenheit: number;
};
const response_handler = (
  api_response: WeatherApiResponseType,
): ValidatedApiResponseType => {
  const currentUnit = Object.keys(api_response)?.[0];
  if (currentUnit === "celcius") {
    return {
      ...api_response,
      fahrenheit: celsiusToFahrenheit(api_response.celcius),
    };
  }
  return {
    ...api_response,
    celcius: farhenheitToCelsius(api_response.fahrenheit),
  };
};

const weather_api_service = async (city: string, date: string) => {
  try {
    const response = await axios.post(
      `https://staging.v4.api.wander.com/hiring-test/weather`,
      {
        city,
        date,
      },
    );
    if (response.status === 200) {
      return response_handler(response.data);
    }
    throw response.data;
  } catch (err) {
    throw new ErrorResponse(
      "External API error. Please try again later",
      500,
      err,
    );
  }
};

export default {
  weather_api_service,
};
