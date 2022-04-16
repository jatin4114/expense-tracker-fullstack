// FAKE data just so i can build the UI before the backend is connected
// this file will basically become useless after phase 4 when we fetch
// real data from the api, but keeping it around for now

export const sampleExpenses = [
  { id: 1, title: "Pizza with friends", amount: 450, category: "Food", date: "2026-09-05", description: "", payment_method: "UPI" },
  { id: 2, title: "Bus pass", amount: 600, category: "Transport", date: "2026-09-01", description: "monthly pass", payment_method: "Cash" },
  { id: 3, title: "DSA course", amount: 999, category: "Education", date: "2026-08-28", description: "udemy course", payment_method: "Card" },
  { id: 4, title: "New headphones", amount: 1500, category: "Shopping", date: "2026-08-25", description: "", payment_method: "Card" },
  { id: 5, title: "Movie night", amount: 350, category: "Entertainment", date: "2026-08-20", description: "", payment_method: "UPI" },
  { id: 6, title: "Mobile recharge", amount: 299, category: "Bills", date: "2026-08-18", description: "", payment_method: "UPI" },
  { id: 7, title: "Coffee", amount: 120, category: "Food", date: "2026-08-15", description: "", payment_method: "Cash" },
];

export const sampleBudget = {
  monthly_limit: 8000,
};
