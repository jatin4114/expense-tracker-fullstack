import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/budget" element={<Budget />} />
      </Route>
    </Routes>
  );
}

export default App;
