import { Response } from "express";
import { CUSTOM_ERROR_PREFIX } from "./constants";
export class ErrorResponse extends Error {
  statusCode: number;
  stack;
  constructor(message: string, statusCode: number, stack: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
  }
}

export const error_handler = (error: ErrorResponse, res: Response) => {
  const error_id = new Date().getTime();
  console.log({
    error_id,
    error: error?.stack || error,
  });
  res.status(error?.statusCode || 500).json({
    success: false,
    message: error?.message?.startsWith(CUSTOM_ERROR_PREFIX)
      ? error?.message
      : "Something went wrong. We're working on it",
    error_id,
  });
};
