// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.API_URL, // ✅ Your backend URL
  withCredentials: true, // ✅ Always send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
