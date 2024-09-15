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
  const error_packet = {
    success: false,
    message: error?.message?.startsWith(CUSTOM_ERROR_PREFIX)
      ? error?.message
      : GENERIC_ERROR,
    error_id,
  };
  if (test) {
    return {
      ...error_packet,
      status: error?.statusCode || 500,
    };
  }
  res.status(error?.statusCode || 500).json(error_packet);
};
