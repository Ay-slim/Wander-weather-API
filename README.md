# Wander Weather

## Overview

A simple app to fetch weather temperature data efficiently from an API by caching in a SQLite database.

## Installation and local setup

- Clone this repo (ssh: `git clone git@github.com:Ay-slim/Wander-weather-API.git` or https: `https://github.com/Ay-slim/Wander-weather-API.git`)
- Ensure you have the docker daemon running on your machine either via the terminal or docker desktop
- Run the `docker build -t wander_weather .` command at your terminal or cmd line to build a container named wander_weather
- Run the `docker run -p 8080:8080 wander_weather` command to start the app.
- The app should be running at `http://localhost:8080`

## API functionalities

### Endpoint

- There's a single get endpoint at the app's root that accepts two parameters:
  - city: A string that's the name of any city around the world
  - date: An iso8601 date string indicating the date for which the weather temperature should be viewed

#### Request and response structure

- Successful request:

Body:

```
{
    "city": "Ohio",
    "date": "2024-05-15"
}
```

Response:

```
200 OK

{
    "data": {
        "celcius": "7.55",
        "fahrenheit": "45.59"
    },
    "success": true,
    "message": "Api data fetched"
}
```

- Failed Request:

Body:

```
{
    "city": "Ohio",
    "date": "2024-50-15"
}
```

Response:

```
422 UNPROCESSABLE ENTITY
{
    "success": false,
    "message": "ERROR: 'date' must be a valid ISO date (use the format yyyy-mm-dd)",
    "error_id": 1726350852106
}
```

### Temperature conversion:

- The API being called either returns the temperature in celsius or fahrenheit. This app normalizes the data and returns both units.

## Caching

- An SQLite file database was used to cache the API data to prevent getting rate limited. This was done by saving temperature data to SQLite on the first API call, and subsequent calls with the same city and date request values are fetched from the DB. A cache expiry config value specifies how long data can be cached before being considered stale and removed from the cache (for this app, it's set to one hour for now, you can play around with this by changing CACHE_EXPIRY variable value at `src/utils/constants.ts`).
- Caching improved the performance by reducing the query response time from between 800ms and 1 second to an average of 4 to 5ms for cached requests

### Technical considerations for caching

- There were two approaches considered in implementing caching:
  1. Running a cron job (which would be run by a background worker if this was a production environment) that would periodically check the db and delete any data stored in the cache beyond the cache expiry period
  2. For every request to the app, check the cache for any existing data, if expired, delete the data, make an API call, and cache the new response for subsequent requests to use. A cache_time integer value representing the time caching occurred is stored alongside the data and used to check for staleness when the next request is made

### Pros and cons of the two alternatives

- Approach 1 means one less operation per API request as there would be no need to check for and delete expired caches on every request. However, this would also mean at least one operation at every set cron interval. This could be useful if the app gets heavy traffic (lots of requests within the cron interval). Another drawback is that there'll always be a window within which requests will possibly be fetching stale data (say expiry is 1 hour and the cron runs every 5 minutes, there'll always be a 5 minute window within which the app is likely serving stale data). For an app with minimal traffic, this could be an overkill.
- Approach 2 is perfect for minimal traffic apps, as you don't have to worry about stale data until a request is made, and was chosen for this reason.

## Error handling

- The main endpoint to the app is wrapped in a try-catch block. Within the services, utils, and validation logic, explanatory custom error messages are thrown and the catch block returns these error messages to the user (they are marked with a prefix) while the error itself is logged (to the console in this demo, but to actual log systems in production) with unique error_ids and the trace stack to make debugging easy. Unhandled errors are not allowed to bubble to the user because a generic error message is returned to hide away system details but the error itself is also logged to make debugging easy.
- In the event of database failure, the caching mechanism is designed to fail silently and allow the user to fetch data directly from the API. However, an error (with high severity alert if in production) is sent to the logs to notify the team about the failure and getting it fixed.

## Data validation and consistency

- The payload is validated with the joi library and any errors are thrown appropriately if invalid data is passed.
- When caching, the city value is trimmed and converted to lower case, all cache fetch requests also do the same to ensure that differences in spelling or white space do not lead to caching the same data multiple times.

## Synchronous vs. Asynchronous calls

- The cache write and delete operations are done asynchronously by executing them in a promise without using the await keyword. This is to ensure that users don't have to wait for caching to happen first before getting data back. Probably saves only a few milliseconds and makes no difference here, but at scale it could make a difference

## Testing

- The Jest library was used for testing each of the temeperature conversion utils individually as well as the full service data fetch service and caching

![alt text](<Screenshot 2024-09-14 at 9.09.03 PM.png>)
