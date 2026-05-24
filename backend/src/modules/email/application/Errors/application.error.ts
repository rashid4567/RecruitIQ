export class ApplicationError extends Error {
  public readonly code: string;

  constructor(code: string, message?: string) {
    super(message || ApplicationError.formatCode(code));

    this.code = code;
    this.name = "ApplicationError";

    Object.setPrototypeOf(this, ApplicationError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  private static formatCode(code: string): string {
    return code
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
