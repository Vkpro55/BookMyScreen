import axios, { isAxiosError } from "axios";
import type { AxiosResponse } from "axios";
import type { ApiError, ApiResponse } from "./types";

const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

export class ApiRequestError extends Error {
  readonly apiErrors?: ApiError | ApiError[];

  constructor(message: string, apiErrors?: ApiError | ApiError[]) {
    super(message);
    this.name = "ApiRequestError";
    this.apiErrors = apiErrors;
  }
}

const formatApiErrors = (errors?: ApiError | ApiError[]): string => {
  if (!errors) return "API request failed";
  if (Array.isArray(errors)) return errors.map((e) => e.message).join(", ");
  return errors.message;
};

export const axiosWrapper = axios.create({
  baseURL:
    typeof import.meta.env.VITE_BACKEND_URL === "string"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: defaultHeaders,
});

axiosWrapper.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    if (response.data.success === false) {
      return Promise.reject(
        new ApiRequestError(
          formatApiErrors(response.data.errors),
          response.data.errors,
        ),
      );
    }
    return response;
  },
  (error: unknown) => {
    if (isAxiosError(error)) {
      return Promise.reject(new ApiRequestError(error.message));
    }
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);
