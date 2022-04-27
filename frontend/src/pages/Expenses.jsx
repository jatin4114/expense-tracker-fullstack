import { useEffect, useMemo, useState } from "react";
import { getExpenses, createExpense, updateExpense, deleteExpense } from "../api/expenses";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import DeleteConfirm from "../components/expenses/DeleteConfirm";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);

  // filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState(""); // format: "2026-09"

  useEffect(() => {
    loadExpenses();
  }, []);

  function loadExpenses() {
    setLoading(true);
    setError(null);
    getExpenses()
      .then((data) => setExpenses(data))
      .catch((err) => {
        console.error(err);
        setError("Could not load expenses. Is the backend running?");
      })
      .finally(() => setLoading(false));
  }

  async function handleAddExpense(formData) {
    const newExpense = await createExpense(formData);
    setExpenses((prev) => [newExpense, ...prev]);
    setShowAddModal(false);
  }

  async function handleEditExpense(formData) {
    const updated = await updateExpense(editingExpense.id, formData);
    setExpenses((prev) => prev.map((exp) => (exp.id === updated.id ? updated : exp)));
    setEditingExpense(null);
  }

  async function handleDeleteExpense(expense) {
    await deleteExpense(expense.id);
    setExpenses((prev) => prev.filter((exp) => exp.id !== expense.id));
    setDeletingExpense(null);
  }

  // apply search + category + month filters (all client side, list is
  // small enough that we dont need to hit the api again for this)
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchesSearch = exp.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || exp.category === category;
      const matchesMonth = !month || exp.date.startsWith(month);
      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [expenses, search, category, month]);

  return (
    <div>
      <div className="expenses-header">
        <h2>All Expenses</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Expense
        </button>
      </div>

      {!loading && !error && (
        <ExpenseFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          month={month}
          setMonth={setMonth}
        />
      )}

      <div className="card">
        {loading && <LoadingSpinner text="Loading expenses..." />}
        {!loading && error && <ErrorMessage message={error} onRetry={loadExpenses} />}
        {!loading && !error && (
          <ExpenseList
            expenses={filteredExpenses}
            onEdit={(exp) => setEditingExpense(exp)}
            onDelete={(exp) => setDeletingExpense(exp)}
          />
        )}
      </div>

      {showAddModal && (
        <Modal title="Add Expense" onClose={() => setShowAddModal(false)}>
          <ExpenseForm
            onSubmit={handleAddExpense}
            onCancel={() => setShowAddModal(false)}
            submitLabel="Add Expense"
          />
        </Modal>
      )}

      {editingExpense && (
        <Modal title="Edit Expense" onClose={() => setEditingExpense(null)}>
          <ExpenseForm
            initialData={editingExpense}
            onSubmit={handleEditExpense}
            onCancel={() => setEditingExpense(null)}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {deletingExpense && (
        <DeleteConfirm
          expense={deletingExpense}
          onConfirm={handleDeleteExpense}
          onCancel={() => setDeletingExpense(null)}
        />
      )}
    </div>
  );
}

export default Expenses;
