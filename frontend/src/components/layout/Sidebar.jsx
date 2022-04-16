import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// list of nav links, easier to loop over than writing each NavLink by hand
const navItems = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/expenses", label: "Expenses", icon: "💸" },
  { to: "/analytics", label: "Analytics", icon: "📊" },
  { to: "/budget", label: "Budget", icon: "🎯" },
];

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* dark overlay behind sidebar on mobile when its open */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={"sidebar " + (isOpen ? "sidebar-open" : "")}>
        <div className="sidebar-logo">
          <span className="logo-icon">💰</span>
          <span>ExpenseTracker</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
              onClick={onClose}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Smart Expense Tracker</p>
          <p className="sidebar-version">v1.0 - student project</p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
