import { describe, test, expect } from "@jest/globals";
import fetch_weather_from_api, {
  celsius_to_fahrenheit,
  convert_temperature_units,
  farhenheit_to_celsius,
} from "./utils/weather_helpers";
import {
  cacheTemperature,
  deleteExpiredCache,
  fetchCachedTemperature,
} from "./services/cache";
import { weather_api_service } from "./services";
import { error_handler } from "./utils/error_response";
import { CUSTOM_ERROR_PREFIX, GENERIC_ERROR } from "./utils/constants";

describe("Test conversion functions", () => {
  test("Farenheit to clecius", () => {
    expect(farhenheit_to_celsius(32)).toEqual(0);
  });
  test("Celcius to Farenheit", () => {
    expect(celsius_to_fahrenheit(100)).toEqual(212);
  });
});

describe("Test Api response normalizer", () => {
  test("Validate that a celcius only response returns both celcius and farhenheit", () => {
    const normalizedCelcius = convert_temperature_units({
      celcius: 0,
    });
    expect(normalizedCelcius).toBeInstanceOf(Object);
    expect(normalizedCelcius.fahrenheit).toBe(32);
    expect(normalizedCelcius.celcius).toBe(0);
  });
  test("Validate that a farhenheit only response returns both celcius and farhenheit", () => {
    const normalizedFarhenheit = convert_temperature_units({
      fahrenheit: 212,
    });
    expect(normalizedFarhenheit).toBeInstanceOf(Object);
    expect(normalizedFarhenheit.celcius).toBe(100);
    expect(normalizedFarhenheit.fahrenheit).toBe(212);
  });
});

describe("Test Caching", () => {
  cacheTemperature("Owo", "2024-03-02", { celcius: 0, fahrenheit: 32 });
  let write_cache_time = 0;
  test("Validate cache write and fetch (including input normalization)", async () => {
    const { temperature, cache_time } = await fetchCachedTemperature(
      "Owo",
      "2024-03-02",
    );
    write_cache_time = cache_time;
    const parsed_temp = JSON.parse(temperature);
    expect(parsed_temp).toBeInstanceOf(Object);
    expect(parsed_temp.fahrenheit).toBe(32);
    expect(parsed_temp.celcius).toBe(0);
  });
  test("Validate cache deletion ", async () => {
    await deleteExpiredCache("Owo", "2024-03-02", write_cache_time);
    const deleted_cache = await fetchCachedTemperature("Owo", "2024-03-02");
    expect(deleted_cache).toBe(null);
  });
});

describe("Test system logic end to end (data fetch + caching)", () => {
  test("Full system test with 5 seconds cache expiry simulation", async () => {
    await weather_api_service("ife", "2024-03-01", 5000);
    const { temperature: existingTemp, cache_time } =
      await fetchCachedTemperature("ife", "2024-03-01");
    await new Promise((resolve) => setTimeout(resolve, 7000));
    await weather_api_service("ife", "2024-03-01", 5000);
    const { cache_time: new_cache_time } = await fetchCachedTemperature(
      "ife",
      "2024-03-01",
    );
    expect(JSON.parse(existingTemp)).toBeInstanceOf(Object);
    expect(typeof JSON.parse(existingTemp)?.fahrenheit).toBe("number");
    expect(typeof JSON.parse(existingTemp)?.celcius).toBe("number");
    expect(cache_time).not.toEqual(new_cache_time);
  }, 20000);
});

describe("Test error handling", () => {
  test("Simulate a custom error response to an error response from the API ", async () => {
    try {
      await fetch_weather_from_api("okokomaiko", "2024-30-01");
    } catch (err) {
      const error_value = error_handler(err, null, true);
      expect(error_value).toBeInstanceOf(Object);
      expect(error_value.status).toBe(500);
      expect(error_value.message).toBe(
        `${CUSTOM_ERROR_PREFIX}Our providers are down at the moment. Please try again later`,
      );
    }
  });
  test("Simulate a generic error response to an unhandled error", async () => {
    try {
      convert_temperature_units({}, true);
    } catch (err) {
      const error_value = error_handler(err, null, true);
      expect(error_value).toBeInstanceOf(Object);
      expect(error_value.status).toBe(500);
      expect(error_value.message).toBe(GENERIC_ERROR);
    }
  });
});
