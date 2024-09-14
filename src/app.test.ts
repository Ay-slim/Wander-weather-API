import { describe, test, expect } from "@jest/globals";
import {
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

describe("Test caching service end to end", () => {
  test("Full cache test 5 seconds expiry", async () => {
    await weather_api_service("ife", "2024-03-01", 5000);
    const { temperature: existingTemp, cache_time } =
      await fetchCachedTemperature("ife", "2024-03-01");
    await new Promise((resolve) => setTimeout(resolve, 12000));
    await weather_api_service("ife", "2024-03-01", 5000);
    const { cache_time: new_cache_time } = await fetchCachedTemperature(
      "ife",
      "2024-03-01",
    );
    expect(JSON.parse(existingTemp)).toBeInstanceOf(Object);
    expect(cache_time).not.toEqual(new_cache_time);
  }, 20000);
});
