import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../lib/auth";

function Layout() {
  const user = getStoredUser();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="shell">
      <div className="noise" />
      <header className="topbar">
        <Link to="/" className="brandmark">
          <span className="brand-dot" />
          <div>
            <strong>DevConnect</strong>
            <small>Developer publishing platform</small>
          </div>
        </Link>

        <nav className="nav">
          <NavLink to="/">Explore</NavLink>
          {user && <NavLink to="/create-post">Write</NavLink>}
          {user && <NavLink to="/profile">Profile</NavLink>}
          {!user && <NavLink to="/login">Login</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          {user && (
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <Outlet />
    </div>
  );
}

export default Layout;
