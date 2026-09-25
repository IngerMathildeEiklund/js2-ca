export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function getErrorMessage(error: unknown): string {
  console.log(error);
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong, please try again.";
}
