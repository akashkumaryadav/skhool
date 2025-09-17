// src/axiosInstance.js
"use client";
import axios from "axios";
import { handleRefreshToken } from "./api/api";

// const getToken = () => {
//   return localStorage.getItem("token");
// };

const axiosInstance = axios.create({
  baseURL: process.env.API_URL, // ✅ Your backend URL
  // withCredentials: true, // ✅ Always send cookies
  // headers: {
  //   Authorization: `Bearer ${getToken()}`, // Include token if available
  // }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or retrieve from cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleRefreshToken(localStorage.getItem("refresh_token") || "").then(
        (data) => {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
        }
      );
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
