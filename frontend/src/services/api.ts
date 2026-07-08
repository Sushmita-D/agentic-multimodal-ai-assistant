import axios from "axios";

// Smart base URL detection
const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // 1. Check user-defined dynamic override in localStorage
    const stored = localStorage.getItem("custom_backend_url");
    if (stored) return stored;
  }

  // 2. Check Vite environment variable configurations
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;

  return "http://localhost:8000"; // Standard local FastAPI port
};

// Configurable API Instance
export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 120000, // 2-minute limit for heavy document ingestion or LLM generations
});

// Interceptor to dynamically sync baseURL if it is changed in settings
api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

// Helper to query active backend coordinates
export const getActiveBackendUrl = (): string => {
  return getBaseUrl();
};

// Helper to save dynamic backend configuration overrides
export const setCustomBackendUrl = (url: string): void => {
  if (typeof window !== "undefined") {
    if (!url.trim()) {
      localStorage.removeItem("custom_backend_url");
    } else {
      let formatted = url.trim();
      if (formatted.endsWith("/")) {
        formatted = formatted.slice(0, -1);
      }
      localStorage.setItem("custom_backend_url", formatted);
    }
  }
};
