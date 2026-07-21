export type ApiErrorCode = "VALIDATION_ERROR" | "SUPABASE_ERROR" | "CONFIGURATION_ERROR" | "NOT_FOUND";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;

  constructor(code: ApiErrorCode, message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

export function validationError(message: string) {
  return new ApiError("VALIDATION_ERROR", message, 400);
}

export function supabaseError(message: string) {
  return new ApiError("SUPABASE_ERROR", message, 500);
}

export function configurationError(message: string) {
  return new ApiError("CONFIGURATION_ERROR", message, 500);
}
