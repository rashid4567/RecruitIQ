import axios from "axios";

export function getError(
  err: unknown,
  fallback: string = "Something went wrong",
): string {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }

    return err.message || fallback;
  }

  if (err instanceof Error) {
    return err.message;
  }

  return fallback;
}
