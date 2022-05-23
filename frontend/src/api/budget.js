import api from "./axios";

export function getBudget() {
  return api.get("/budget").then((res) => res.data);
}

export function updateBudget(monthlyLimit) {
  return api.put("/budget", { monthly_limit: monthlyLimit }).then((res) => res.data);
}

export function getCategoryBudgets() {
  return api.get("/budget/categories").then((res) => res.data);
}

export function setCategoryBudget(category, monthlyLimit) {
  return api
    .put(`/budget/categories/${category}`, { monthly_limit: monthlyLimit })
    .then((res) => res.data);
}

export function deleteCategoryBudget(category) {
  return api.delete(`/budget/categories/${category}`);
}
