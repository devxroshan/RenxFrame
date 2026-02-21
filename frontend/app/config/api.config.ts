import axios from "axios";

export interface APIErrorReseponse {
  code: string;
  details: string;
  msg: string;
  name: string;
  ok: boolean;
  path: string;
  timestamp: string;
  status: number;
}

export interface APISuccessResponse {
  ok: boolean;
  msg: string;
  data?: any
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorObj: APIErrorReseponse = {
      code: "",
      details: "",
      msg: "",
      name: "",
      ok: false,
      path: "",
      timestamp: "",
      status: error.response?.status || 500,
    };

    if (error instanceof axios.AxiosError) {
      if (error.response) {
        Object.assign(errorObj, error.response.data);
      }

      if (process.env.NODE_ENV === "development") {
        console.log({
          ...errorObj,
        });
      }
    }

    return Promise.reject({
      ...errorObj,
      rawError: error,
    });
  },
);

export default api;
