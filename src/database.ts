import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./weather.db");

db.serialize(() => {
  // db.run(`DROP TABLE temperature_cache`); // Optionally drop the table and recreate if a 'migration' has taken place
  db.run(`
        CREATE TABLE IF NOT EXISTS temperature_cache (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            city TEXT,
            date TEXT,
            temperature TEXT,
            cache_time INTEGER
        )
    `);
});
