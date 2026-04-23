import { useState } from "react";
import { updateProfile } from "../lib/api";
import { getStoredToken, getStoredUser, saveAuth } from "../lib/auth";

function ProfilePage() {
  const token = getStoredToken();
  const storedUser = getStoredUser();
  const [form, setForm] = useState({
    name: storedUser?.name || "",
    bio: storedUser?.bio || "",
    avatarUrl: storedUser?.avatarUrl || "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      const data = await updateProfile(token, storedUser.id, form);
      saveAuth(token, data.user);
      setMessage("Profile updated");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page narrow-page">
      <section className="form-panel">
        <p className="label">Profile</p>
        <h1>Update your profile</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Avatar URL"
            value={form.avatarUrl}
            onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
          />
          <textarea
            placeholder="Bio"
            value={form.bio}
            onChange={(event) => setForm({ ...form, bio: event.target.value })}
          />
          <input
            type="password"
            placeholder="New password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          {message && <p className="state-text">{message}</p>}
          {error && <p className="state-text error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
