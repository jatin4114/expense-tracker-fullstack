import { CATEGORIES } from "../../utils/categories";
import "./ExpenseFilters.css";

// search box + category dropdown + month picker, all controlled from
// the parent (Expenses page) so it can filter the list
function ExpenseFilters({ search, setSearch, category, setCategory, month, setMonth }) {
  function clearFilters() {
    setSearch("");
    setCategory("All");
    setMonth("");
  }

  const hasActiveFilters = search || category !== "All" || month;

  return (
    <div className="filters-bar card">
      <input
        type="text"
        className="filter-search"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="All">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />

      {hasActiveFilters && (
        <button className="btn btn-secondary" onClick={clearFilters}>
          Clear
        </button>
      )}
    </div>
  );
}

export default ExpenseFilters;
