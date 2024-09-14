import { db } from "../database";
import { ValidatedApiResponseType } from "../utils/types";

export const fetchTemperature = (city: string, date: string) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM temperature_cache WHERE city = ? AND date = ?",
      [city, date],
      (err, row) => {
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
      [city, date, JSON.stringify(temperature), cache_time],
      (err) => {
        if (err) reject(err);
        resolve();
      },
    );
  });
};

export const deleteExpiredCache = async (city: string, date: string) => {
  return new Promise<void>((resolve, reject) => {
    db.run(
      "DELETE FROM temperature_cache WHERE city = ? AND date = ?",
      [city, date],
      (err) => {
        if (err) reject(err);
        resolve();
      },
    );
  });
};
