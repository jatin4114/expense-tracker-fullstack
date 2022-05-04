import api from "./axios";

export function registerUser(email, password) {
  return api.post("/auth/register", { email, password }).then((res) => res.data);
}

export function loginUser(email, password) {
  return api.post("/auth/login", { email, password }).then((res) => res.data);
}
