import api from "./axios";

export function getSummary() {
  return api.get("/analytics/summary").then((res) => res.data);
}

export function getCategoryBreakdown() {
  return api.get("/analytics/categories").then((res) => res.data);
}

export function getMonthlyBreakdown() {
  return api.get("/analytics/monthly").then((res) => res.data);
}
