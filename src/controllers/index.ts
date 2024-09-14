import { Request, Response } from "express";
import { weather_api_service } from "../services";
import { error_handler } from "../utils/error_response";
import { CACHE_EXPIRY } from "../utils/constants";

export default async (req: Request, res: Response) => {
  try {
    const { city, date } = req.body;
    const api_response = await weather_api_service(city, date, CACHE_EXPIRY);
    res.status(200).json({
      data: api_response,
      success: true,
      message: "Api data fetched",
    });
  } catch (error) {
    error_handler(error, res);
  }
};
