export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
  timestamp: string;
};

export type ApiValidationErrors = Record<string, string>;

export type ApiErrorResponse = {
  success: false;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: ApiValidationErrors;
  timestamp: string;
};
