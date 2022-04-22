import { useState } from "react";
import Modal from "../common/Modal";

// little confirmation popup before actually deleting an expense
// (dont want people to accidentally delete stuff with one click)
function DeleteConfirm({ expense, onConfirm, onCancel }) {
  const [deleting, setDeleting] = useState(false);

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm(expense);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Delete Expense" onClose={onCancel}>
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
