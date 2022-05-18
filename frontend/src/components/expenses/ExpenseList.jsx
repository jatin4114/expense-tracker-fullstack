import { useMemo, useState } from "react";
import { CATEGORY_COLORS } from "../../utils/categories";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import "./ExpenseList.css";

const PAGE_SIZE = 10;

// list of expenses, with edit/delete buttons, sortable columns and
// pagination (so a long list doesnt just become one giant scroll)
function ExpenseList({ expenses, onEdit, onDelete, hasFilters }) {
  const [sortField, setSortField] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

  function handleSort(field) {
    if (field === sortField) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  const sortedExpenses = useMemo(() => {
    const sorted = [...expenses].sort((a, b) => {
      let result = 0;
      if (sortField === "title") result = a.title.localeCompare(b.title);
      else if (sortField === "amount") result = a.amount - b.amount;
      else result = a.date.localeCompare(b.date);
      return sortDir === "asc" ? result : -result;
    });
    return sorted;
  }, [expenses, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageExpenses = sortedExpenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (expenses.length === 0) {
    return hasFilters ? (
      <EmptyState
        icon="🔍"
        title="No matching expenses"
        message="Try adjusting or clearing your filters."
      />
    ) : (
      <EmptyState
        icon="🧾"
        title="No expenses yet"
        message="Add your first expense using the button above."
      />
    );
  }

  function sortArrow(field) {
    if (field !== sortField) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  }

  return (
    <div>
      <div className="expense-list-header">
        <button className="sort-btn" onClick={() => handleSort("title")}>
          Title{sortArrow("title")}
        </button>
        <button className="sort-btn sort-btn-date" onClick={() => handleSort("date")}>
          Date{sortArrow("date")}
        </button>
        <button className="sort-btn sort-btn-amount" onClick={() => handleSort("amount")}>
          Amount{sortArrow("amount")}
        </button>
      </div>

      <div className="expense-list">
        {pageExpenses.map((exp) => (
          <div key={exp.id} className="expense-row">
            <span
              className="expense-cat-badge"
              style={{
                background: (CATEGORY_COLORS[exp.category] || "#999") + "22",
                color: CATEGORY_COLORS[exp.category] || "#999",
              }}
            >
              {exp.category}
            </span>
            <div className="expense-row-main">
              <p className="expense-row-title">{exp.title}</p>
              {exp.description && <p className="expense-row-desc">{exp.description}</p>}
            </div>
            <p className="expense-row-date">{exp.date}</p>
            <p className="expense-row-method">{exp.payment_method}</p>
            <p className="expense-row-amount">₹{exp.amount}</p>
            <div className="expense-row-actions">
              <button className="icon-btn" title="Edit" onClick={() => onEdit(exp)}>
                ✏️
              </button>
              <button className="icon-btn" title="Delete" onClick={() => onDelete(exp)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default ExpenseList;
