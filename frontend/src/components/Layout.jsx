import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAuth, getStoredUser } from "../lib/auth";

const BrandIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2L3 6v8l7 4 7-4V6L10 2z"
      fill="black"
      stroke="black"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

function Layout() {
  const user = getStoredUser();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brandmark">
          <div className="brand-icon">
            <BrandIcon />
          </div>
          <div className="brand-text">
            <span className="brand-name">DevConnect</span>
            <span className="brand-sub">Stories &amp; ideas for builders</span>
          </div>
        </Link>

        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Explore
          </NavLink>

          {user && (
            <NavLink
              to="/create-post"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Write
            </NavLink>
          )}

          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Profile
            </NavLink>
          )}

          {!user && (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
          )}

          {!user && (
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Register
            </NavLink>
          )}

          {user && (
            <button
              type="button"
              className="nav-pill danger"
              onClick={handleLogout}
            >
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