import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api";
import { saveAuth } from "../lib/auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
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
    <main className="page narrow-page">
      <section className="form-panel">
        <p className="label">Join</p>
        <h1>Create your account</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
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
          <textarea
            placeholder="Short bio"
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
          {error && <p className="state-text error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;
