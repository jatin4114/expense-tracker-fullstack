import { useEffect, useState } from "react";
import { getExpenses, createExpense } from "../api/expenses";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import Modal from "../components/common/Modal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";
import "./Expenses.css";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  return (
    <div>
      <div className="expenses-header">
        <h2>All Expenses</h2>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Expense
        </button>
      </div>

      <div className="card">
        {loading && <LoadingSpinner text="Loading expenses..." />}
        {!loading && error && <ErrorMessage message={error} onRetry={loadExpenses} />}
        {!loading && !error && <ExpenseList expenses={expenses} />}
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
    </div>
  );
}

export default Expenses;
