import { useState } from "react";
import Modal from "../common/Modal";

// little confirmation popup before actually deleting an expense
// (dont want people to accidentally delete stuff with one click)
function DeleteConfirm({ expense, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setDeleting(true);
    setError("");
    try {
      await onConfirm(expense);
    } catch (err) {
      console.error(err);
      setError("Could not delete this expense. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <Modal title="Delete Expense" onClose={onCancel}>
      {error && <div className="form-top-error">{error}</div>}
      <p>
        Are you sure you want to delete <strong>{expense.title}</strong> (₹
        {expense.amount})? This cannot be undone.
      </p>
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

export default DeleteConfirm;
