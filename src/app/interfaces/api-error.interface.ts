export interface ApiValidationDetail {
  path: string;
  message: string;
}

export interface ApiError {
  error: string;
  details?: ApiValidationDetail[];
}
