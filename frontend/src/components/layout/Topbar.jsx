import "./Topbar.css";

function Topbar({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onMenuClick}>
        ☰
      </button>
      <h1 className="topbar-title">{title}</h1>
    </header>
  );
}

export default Topbar;
