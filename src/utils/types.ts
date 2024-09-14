export type WeatherApiResponseType = {
  [key in "celcius" | "fahrenheit"]: number;
};
export type ValidatedApiResponseType = {
  celcius: number;
  fahrenheit: number;
};
