import api from "./axios";

export function registerUser(email, password) {
  return api.post("/auth/register", { email, password }).then((res) => res.data);
}

export function loginUser(email, password) {
  return api.post("/auth/login", { email, password }).then((res) => res.data);
}

export function getMe() {
  return api.get("/auth/me").then((res) => res.data);
}

export function changePassword(currentPassword, newPassword) {
  return api
    .put("/auth/password", { current_password: currentPassword, new_password: newPassword })
    .then((res) => res.data);
}

export function deleteAccount(password) {
  return api.delete("/auth/me", { data: { password } });
}
