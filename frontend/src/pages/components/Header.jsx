import { Link } from "react-router-dom";
import "./Header.css";
import { useState } from "react";

export default function Header({ userName, tabs = [], showLogout = true }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    window.location.href = "/";
  };

  const [isOpen,setIsOpen]=useState(false);

  const toggleMenu=()=>{
    setIsOpen(!isOpen)
  }

  return (
    <div className="headerWrapper">
      <h2 className="headerWelcome">Bun venit, {userName}!</h2>

      <button className="hamburgerBtn" onClick={toggleMenu}>
        ☰
      </button>

      <div className={`headerTabs ${isOpen ? "open" : ""}`}>
        <button className="closeBtn" onClick={toggleMenu}>
          ✕
        </button>
        {tabs.map((tab) => (
          <Link
            key={tab.label}
            to={tab.to}
            className="headerTab"
            onClick={toggleMenu}
          >
            {tab.label}
          </Link>
        ))}

        {showLogout && (
          <button className="logoutBtn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}