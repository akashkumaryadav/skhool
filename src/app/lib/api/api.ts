// src/app/lib/api.ts (or wherever you store API functions)
import axios from 'axios';

const API_BASE_URL = 'https://6952-2401-4900-1c27-f805-89a9-c7da-e578-cc17.ngrok-free.app'; // Your API base URL

export const fetchUser = async (userId: string) => {
  const response = await axios.get(`${API_BASE_URL}/user/1`, {
    headers: {
      'Cookie': 'JSESSIONID=3E1320DCF1882CBB694EF387B915E758', // Note: Storing cookies like this is not recommended in a real application
    },
  });
  return response.data;
};
