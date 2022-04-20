import axios from "axios";

// this is the base axios instance, all api calls use this
// so we dont have to type the base url everywhere
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

export default api;
