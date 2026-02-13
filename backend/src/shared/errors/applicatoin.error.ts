export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message?: string
  ) {
    super(message ?? code);
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
