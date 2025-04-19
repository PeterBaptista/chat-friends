import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  withCredentials: true, // send cookies automatically for same-origin or cross-origin if CORS allows
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
