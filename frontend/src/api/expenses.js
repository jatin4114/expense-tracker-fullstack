import api from "./axios";

// all the expense related api calls in one place

export function getExpenses() {
  return api.get("/expenses").then((res) => res.data);
}

export function createExpense(data) {
  return api.post("/expenses", data).then((res) => res.data);
}

export function updateExpense(id, data) {
  return api.put(`/expenses/${id}`, data).then((res) => res.data);
}

export function deleteExpense(id) {
  return api.delete(`/expenses/${id}`);
}

// downloads all the user's expenses as a csv file
export function exportExpensesCSV() {
  return api.get("/expenses/export", { responseType: "blob" }).then((res) => res.data);
}
