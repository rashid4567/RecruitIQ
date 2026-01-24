export class ApplicationError extends Error {
  constructor(public readonly code: string) {
    super(code);
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}
