
import {
  LayoutDashboard,
  BookOpen,
  ArrowLeftRight,
  Users,
  Library
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="logo">
        <Library size={30} />
        <h2>Community Library</h2>
      </div>

      <p className="menu-title">MAIN MENU</p>

      <nav>
        <NavLink to="/" end className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/books" className="nav-link">
          <BookOpen size={20} />
          <span>Books</span>
        </NavLink>

        <NavLink to="/transactions" className="nav-link">
          <ArrowLeftRight size={20} />
          <span>Transactions</span>
        </NavLink>

        <NavLink to="/users" className="nav-link">
          <Users size={20} />
          <span>Users</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>Library Management System</p>
        <small>Version 1.0</small>
      </div>

    </aside>
  );
}

export default Sidebar;
