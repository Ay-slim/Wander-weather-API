import { Request, Response, NextFunction } from "express";
import payload from "../validators/payload";
import { ErrorResponse, error_handler } from "../utils/error_response";

const validatePayload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const values = await payload.validateAsync(req.body);
    req.body = values;
    return next();
  } catch (error) {
    error_handler(new ErrorResponse(error?.message, 422, error), res);
  }
};

export default validatePayload;
