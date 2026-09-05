import type { AxiosRequestConfig, Method } from "axios";

import { apiClient } from "@/lib/api/api-client";
import { normalizeApiError } from "@/lib/api/api-error";
import type { ApiResponse } from "@/lib/api/api-types";

type RequestConfig = Omit<AxiosRequestConfig, "data" | "method" | "url">;

async function requestEnvelope<T>(
  method: Method,
  url: string,
  config: AxiosRequestConfig = {},
): Promise<ApiResponse<T>> {
  try {
    const response = await apiClient.request<ApiResponse<T>>({
      ...config,
      method,
      url,
    });

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

async function request<T>(method: Method, url: string, config: AxiosRequestConfig = {}): Promise<T> {
  const response = await requestEnvelope<T>(method, url, config);

  return response.data;
}

function get<T>(url: string, config?: RequestConfig) {
  return request<T>("get", url, config);
}

function post<T, TBody = undefined>(url: string, data?: TBody, config?: RequestConfig) {
  return request<T>("post", url, { ...config, data });
}

function put<T, TBody = undefined>(url: string, data?: TBody, config?: RequestConfig) {
  return request<T>("put", url, { ...config, data });
}

function patch<T, TBody = undefined>(url: string, data?: TBody, config?: RequestConfig) {
  return request<T>("patch", url, { ...config, data });
}

function remove<T, TBody = undefined>(url: string, data?: TBody, config?: RequestConfig) {
  return request<T>("delete", url, { ...config, data });
}

export { get, patch, post, put, remove, request, requestEnvelope };
export type { RequestConfig };
