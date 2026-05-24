export function isNotFoundError(error: unknown): boolean {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const err = error as { response?: { status?: number } };

    return err.response?.status === 404;
  }

  return false;
}