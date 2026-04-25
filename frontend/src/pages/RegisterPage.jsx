import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api";
import { saveAuth } from "../lib/auth";

function UserIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 12c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

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

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
  });
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
      const data = await registerUser(form);
      saveAuth(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-auth">
      <div className="auth-card">
        <span className="eyebrow">Join</span>
        <h1>Create account</h1>
        <p className="auth-desc">
          Register once, your session stays saved in the browser after refresh.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <UserIcon />
            <input
              className="field has-icon"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={update("name")}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="Password (min 6 characters)"
              value={form.password}
              onChange={update("password")}
              minLength={6}
              required
              autoComplete="new-password"
            />
          </div>

          <textarea
            className="field"
            placeholder="Short bio"
            value={form.bio}
            onChange={update("bio")}
            rows={3}
          />

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;