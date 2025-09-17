// src/app/lib/api.ts (or wherever you store API functions)

"use server"; // Ensure this runs on the server side

import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = "http://localhost:8080"; // Your API base URL

export const fetchUser = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/user/1`, {
    headers: {
      Cookie: "JSESSIONID=3E1320DCF1882CBB694EF387B915E758", // Note: Storing cookies like this is not recommended in a real application
    },
  });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username,
    password,
  });
  (await cookies()).set("auth_token", response.data.access_token, {
    httpOnly: true, // JS cannot read
    secure: true, // only over HTTPS
    sameSite: "lax",
    path: "/",
  });
  return response.data;
};

export const handleRefreshToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refresh_token: refreshToken,
    });

    (await cookies()).set("auth_token", response.data.access_token, {
      httpOnly: true, // JS cannot read
      secure: true, // only over HTTPS
      sameSite: "lax",
      path: "/",
    });
    return response.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};
