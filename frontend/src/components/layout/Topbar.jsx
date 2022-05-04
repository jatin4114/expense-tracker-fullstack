import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Topbar.css";

function Topbar({ title, onMenuClick }) {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>
      <h1 className="topbar-title">{title}</h1>

      <div className="topbar-user">
        <span className="topbar-email">{userEmail}</span>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Topbar;
