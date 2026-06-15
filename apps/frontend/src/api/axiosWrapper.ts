import axios, { isAxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type { ApiError, ApiResponse } from "./types";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

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

export const formatApiErrors = (errors?: ApiError | ApiError[]): string => {
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

const refreshClient = axios.create({
  baseURL:
    typeof import.meta.env.VITE_BACKEND_URL === "string"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: defaultHeaders,
});

const refreshAccessToken = async (): Promise<void> => {
  await refreshClient.get("/auth/refresh-token");
};

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
  async (error: unknown) => {
    if (!isAxiosError(error)) {
      return Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      if (originalRequest.url?.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      originalRequest._isRetry = true;
      try {
        await refreshAccessToken();
        return axiosWrapper.request(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
