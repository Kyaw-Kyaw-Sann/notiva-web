import axios from "axios";

import { env } from "@/lib/constants/env";

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: "application/json",
  },
});
