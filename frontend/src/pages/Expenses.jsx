import { useEffect, useMemo, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpensesCSV,
} from "../api/expenses";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseForm from "../components/expenses/ExpenseForm";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import DeleteConfirm from "../components/expenses/DeleteConfirm";
import Modal from "../components/common/Modal";
import { SkeletonList } from "../components/common/Skeleton";
import ErrorMessage from "../components/common/ErrorMessage";
import { useToast } from "../context/ToastContext";
import { useKeyboardShortcut } from "../utils/useKeyboardShortcut";
import "./Expenses.css";

function Expenses() {
  const { showToast } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [exporting, setExporting] = useState(false);

  // filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [month, setMonth] = useState(""); // format: "2026-09"

  useEffect(() => {
    loadExpenses();
  }, []);

  const anyModalOpen = showAddModal || !!editingExpense || !!deletingExpense;

  // keyboard shortcuts: "n" opens the add expense modal, "Escape"
  // closes whatever modal is currently open
  useKeyboardShortcut("n", () => setShowAddModal(true), !anyModalOpen);
  useKeyboardShortcut(
    "Escape",
    () => {
      setShowAddModal(false);
      setEditingExpense(null);
      setDeletingExpense(null);
    },
    anyModalOpen
  );

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
    showToast("Expense added", "success");
  }

  async function handleEditExpense(formData) {
    const updated = await updateExpense(editingExpense.id, formData);
    setExpenses((prev) => prev.map((exp) => (exp.id === updated.id ? updated : exp)));
    setEditingExpense(null);
    showToast("Expense updated", "success");
  }

  async function handleDeleteExpense(expense) {
    await deleteExpense(expense.id);
    setExpenses((prev) => prev.filter((exp) => exp.id !== expense.id));
    setDeletingExpense(null);
    // "undo" just re-creates the same expense - it'll get a new id,
    // but thats fine for what this is for (fixing a misclick)
    showToast("Expense deleted", "info", {
      label: "Undo",
      onClick: async () => {
        const restored = await createExpense({
          title: expense.title,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          description: expense.description,
          payment_method: expense.payment_method,
        });
        setExpenses((prev) => [restored, ...prev]);
        showToast("Expense restored", "success");
      },
    });
  }

  async function handleDuplicateExpense(expense) {
    const copy = await createExpense({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description,
      payment_method: expense.payment_method,
    });
    setExpenses((prev) => [copy, ...prev]);
    showToast("Expense duplicated", "success");
  }

  async function handleBulkDelete(ids) {
    // delete them one at a time - the list is small enough that this
    // is fine, and it means one failure doesnt take out the whole batch
    let failCount = 0;
    for (const id of ids) {
      try {
        await deleteExpense(id);
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }
    setExpenses((prev) => prev.filter((exp) => !ids.includes(exp.id)));
    if (failCount > 0) {
      showToast(`Deleted ${ids.length - failCount}, ${failCount} failed`, "error");
    } else {
      showToast(`${ids.length} expense(s) deleted`, "success");
    }
  }

  async function handleExportCSV() {
    setExporting(true);
    try {
      const blob = await exportExpensesCSV();
      // create a temporary link to trigger the browser's save dialog,
      // then clean it up right after
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "expenses.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("Expenses exported", "success");
    } catch (err) {
      console.error(err);
      showToast("Could not export expenses. Please try again.", "error");
    } finally {
      setExporting(false);
    }
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
        <div className="expenses-header-actions">
          <button className="btn btn-secondary" onClick={handleExportCSV} disabled={exporting}>
            {exporting ? "Exporting..." : "⬇ Export CSV"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            title="Shortcut: press N"
          >
            + Add Expense
          </button>
        </div>
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
        {loading && <SkeletonList rows={5} />}
        {!loading && error && <ErrorMessage message={error} onRetry={loadExpenses} />}
        {!loading && !error && (
          <ExpenseList
            expenses={filteredExpenses}
            onEdit={(exp) => setEditingExpense(exp)}
            onDelete={(exp) => setDeletingExpense(exp)}
            onDuplicate={handleDuplicateExpense}
            onBulkDelete={handleBulkDelete}
            hasFilters={!!(search || category !== "All" || month)}
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
