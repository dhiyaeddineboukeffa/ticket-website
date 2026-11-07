import axios, { type AxiosInstance, type AxiosResponse } from "axios";

export const api: AxiosInstance = axios.create({
  headers: {
    "Accept-Language": "en-US",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response?.data.error === "UnAuthorized - No Token Provided") {
      localStorage.clear();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
