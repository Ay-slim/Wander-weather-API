import { Request, Response } from "express";
import { RESERVED_ERROR_MESSAGES } from "../utils/constants";
import services from "../services";

export default async (req: Request, res: Response) => {
  try {
    const { city, date } = req.body;
    const api_response = await services.weather_api_service(city, date);
    res.status(200).json({
      data: api_response,
      success: true,
      message: "Api data fetched",
    });
  } catch (error) {
    const error_id = new Date().getTime();
    console.log({
      error_id,
      error: error?.stack || error,
    });
    res.status(error?.statusCode).json({
      success: false,
      message:
        !error?.message || RESERVED_ERROR_MESSAGES.includes(error?.message)
          ? "Something went wrong"
          : error?.message,
      error_id,
    });
  }
};
