import { db } from "../database";
import { ValidatedApiResponseType } from "../utils/types";

type DatabaseWeatherResponse = {
  temperature: string;
  cache_time: number;
} | null;

export const fetchCachedTemperature = (city: string, date: string) => {
  return new Promise<DatabaseWeatherResponse>((resolve, reject) => {
    db.get(
      "SELECT temperature, cache_time FROM temperature_cache WHERE city = ? AND date = ? ORDER BY cache_time DESC LIMIT 1",
      [city.trim().toLowerCase(), date],
      (err, row: DatabaseWeatherResponse) => {
        if (err) reject(err);
        resolve(row || null);
      },
    );
  });
};

export const cacheTemperature = (
  city: string,
  date: string,
  temperature: ValidatedApiResponseType,
) => {
  return new Promise<void>((resolve, reject) => {
    const cache_time = new Date().getTime();
    db.run(
      "INSERT INTO temperature_cache (city, date, temperature, cache_time) VALUES (?, ?, ?, ?)",
      [
        city.trim().toLowerCase(),
        date,
        JSON.stringify(temperature),
        cache_time,
      ],
      (err) => {
        if (err) reject(err);
        resolve();
      },
    );
  });
};

export const deleteExpiredCache = async (
  city: string,
  date: string,
  cache_time: number,
) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      "DELETE FROM temperature_cache WHERE city = ? AND date = ? AND cache_time = ?",
      [city.trim().toLowerCase(), date, cache_time],
      (err) => {
        if (err) reject(err);
        resolve();
      },
    );
  });
};
