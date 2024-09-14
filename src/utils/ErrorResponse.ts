export default class ErrorResponse extends Error {
  statusCode: number;
  stack;
  constructor(message: string, statusCode: number, stack: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
  }
}
