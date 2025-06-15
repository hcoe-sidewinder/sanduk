import axios, { AxiosError } from "axios";
import Constants from "expo-constants";

// const BASE_API_URL = Constants.expoConfig?.extra?.EXPO_BASE_URL;
// const BASE_API_URL = "http://172.16.3.170:5173/api";

const BASE_API_URL = Constants.expoConfig?.extra?.EXPO_BASE_URL;
const GENAI_KEY = Constants.expoConfig?.extra?.GENAI_KEY;
if (!BASE_API_URL) {
  throw new Error("BASE_URL is not defined");
}

console.log(BASE_API_URL);
export const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export const handleApiError = (error: AxiosError | Error): Error => {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message || "An error occurred on the server";
    return new Error(message);
  }

  return new Error(error.message || "An unknown error occurred");
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    throw handleApiError(error);
  }
);
