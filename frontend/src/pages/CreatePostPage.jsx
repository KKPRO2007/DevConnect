import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../lib/api";
import { getStoredToken } from "../lib/auth";

function CreatePostPage() {
  const navigate = useNavigate();
  const token = getStoredToken();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      const data = await createPost(token, form);
      navigate(`/posts/${data.post._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page narrow-page">
      <section className="form-panel">
        <p className="label">Write</p>
        <h1>Publish a post</h1>
        <form onSubmit={handleSubmit} className="form-grid">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Excerpt"
            value={form.excerpt}
            onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
          />
          <input
            type="text"
            placeholder="Tags separated by commas"
            value={form.tags}
            onChange={(event) => setForm({ ...form, tags: event.target.value })}
          />
          <textarea
            placeholder="Your post content"
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            required
          />
          {error && <p className="state-text error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Create post"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default CreatePostPage;
