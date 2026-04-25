import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../lib/api";
import { saveAuth } from "../lib/auth";

function MailIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 4.5L7 8l5.5-3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4.5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const data = await loginUser(form);
      saveAuth(data.token, data.user);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-auth">
      <div className="auth-card">
        <span className="eyebrow">Access</span>
        <h1>Sign in</h1>
        <p className="auth-desc">
          Login to write posts, like stories, and keep your profile saved across sessions.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <MailIcon />
            <input
              className="field has-icon"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={update("email")}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-wrap">
            <LockIcon />
            <input
              className="field has-icon"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={update("password")}
              minLength={6}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;