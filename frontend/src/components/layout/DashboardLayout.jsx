import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./DashboardLayout.css";

// maps the current url to a nice page title for the topbar
const PAGE_TITLES = {
  "/": "Dashboard",
  "/expenses": "Expenses",
  "/analytics": "Analytics",
  "/budget": "Budget",
};

// this wraps every "logged in" page - has the sidebar + topbar
// and the actual page content shows up where <Outlet /> is
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Smart Expense Tracker";

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="layout-main">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
