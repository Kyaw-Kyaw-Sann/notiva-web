import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

import { apiClient } from "@/lib/api/api-client";

declare module "axios" {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    _retry?: boolean;
  }
}

type AuthInterceptorHandlers = {
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string>;
  onSessionExpired: () => void;
};

function getBearerToken(config: AxiosRequestConfig) {
  const authorization = config.headers?.Authorization;

  if (typeof authorization !== "string" || !authorization.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length);
}

function setBearerToken(config: InternalAxiosRequestConfig, accessToken: string) {
  config.headers.set("Authorization", `Bearer ${accessToken}`);
}

export function configureAuthInterceptors(handlers: AuthInterceptorHandlers) {
  const requestInterceptor = apiClient.interceptors.request.use((config) => {
    if (config.skipAuth || getBearerToken(config)) {
      return config;
    }

    const accessToken = handlers.getAccessToken();

    if (accessToken) {
      setBearerToken(config, accessToken);
    }

    return config;
  });

  const responseInterceptor = apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<unknown>) => {
      const originalRequest = error.config;

      if (
        !originalRequest ||
        originalRequest.skipAuth ||
        originalRequest._retry ||
        error.response?.status !== 401
      ) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const failedAccessToken = getBearerToken(originalRequest);
        const currentAccessToken = handlers.getAccessToken();
        const accessToken = currentAccessToken && currentAccessToken !== failedAccessToken
          ? currentAccessToken
          : await handlers.refreshAccessToken();

        setBearerToken(originalRequest, accessToken);
        return apiClient.request(originalRequest);
      } catch {
        handlers.onSessionExpired();
        return Promise.reject(error);
      }
    },
  );

  return () => {
    apiClient.interceptors.request.eject(requestInterceptor);
    apiClient.interceptors.response.eject(responseInterceptor);
  };
}
