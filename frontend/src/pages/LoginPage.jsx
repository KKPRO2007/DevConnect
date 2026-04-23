import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../lib/api";
import { saveAuth } from "../lib/auth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
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
    <main className="page narrow-page">
      <section className="form-panel">
        <p className="label">Access</p>
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
          {error && <p className="state-text error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
