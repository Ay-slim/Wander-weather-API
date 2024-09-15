import { Response } from "express";
import { CUSTOM_ERROR_PREFIX, GENERIC_ERROR } from "./constants";
export class ErrorResponse extends Error {
  statusCode: number;
  stack;
  constructor(message: string, statusCode: number, stack: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
  }
}

export const error_handler = (
  error: ErrorResponse,
  res: Response = null,
  test = false,
) => {
  const error_id = new Date().getTime();
  console.log({
    error_id,
    error: error?.stack || error,
  });
  if (test) {
    return {
      status: error?.statusCode || 500,
      success: false,
      message: error?.message?.startsWith(CUSTOM_ERROR_PREFIX)
        ? error?.message
        : GENERIC_ERROR,
      error_id,
    };
  }
  res.status(error?.statusCode || 500).json({
    success: false,
    message: error?.message?.startsWith(CUSTOM_ERROR_PREFIX)
      ? error?.message
      : "Something went wrong. We're working on it",
    error_id,
  });
};
