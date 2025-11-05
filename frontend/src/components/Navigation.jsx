import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/students", label: "Alunos", icon: "👨‍🎓" },
    { path: "/classes", label: "Turmas", icon: "🏫" },
    { path: "/attendance", label: "Presença", icon: "✅" },
    { path: "/grades", label: "Notas", icon: "📝" },
    { path: "/reports", label: "Relatórios", icon: "📈" },
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>🎓 Controle Acadêmico</h2>
      </div>
      <ul className="nav-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="nav-item">
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
