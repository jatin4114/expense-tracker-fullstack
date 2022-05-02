import api from "./axios";

export function getBudget() {
  return api.get("/budget").then((res) => res.data);
}

export function updateBudget(monthlyLimit) {
  return api.put("/budget", { monthly_limit: monthlyLimit }).then((res) => res.data);
}
