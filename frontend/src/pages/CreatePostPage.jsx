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
    tags: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.content.trim()) { setError("Content is required."); return; }

    try {
      setLoading(true);
      setError("");
      const data = await createPost(token, form);
      navigate(`/posts/${data.post._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const contentLen = form.content.length;
  const maxLen = 10000;

  return (
    <main className="page-create">
      <section className="editor-shell">
        <span className="eyebrow">Write</span>
        <h1>Publish a post</h1>
        <p className="editor-desc">
          Draft something sharp, add a short summary, tag it, and publish to the feed.
        </p>

        <div className="divider" />

        <form onSubmit={handleSubmit}>
          <div className="field-group">
            {/* Title */}
            <div className="field-item">
              <label className="field-label" htmlFor="post-title">Title</label>
              <input
                id="post-title"
                className="field"
                type="text"
                placeholder="Give your post a compelling title"
                value={form.title}
                onChange={update("title")}
                required
              />
            </div>

            {/* Excerpt */}
            <div className="field-item">
              <label className="field-label" htmlFor="post-excerpt">Excerpt</label>
              <input
                id="post-excerpt"
                className="field"
                type="text"
                placeholder="One-sentence summary shown on cards"
                value={form.excerpt}
                onChange={update("excerpt")}
              />
            </div>

            {/* Tags */}
            <div className="field-item">
              <label className="field-label" htmlFor="post-tags">Tags</label>
              <input
                id="post-tags"
                className="field"
                type="text"
                placeholder="react, javascript, tutorial"
                value={form.tags}
                onChange={update("tags")}
              />
              <span className="tag-hint">Separate tags with commas</span>
            </div>

            <div className="divider" />

            {/* Content */}
            <div className="field-item">
              <label className="field-label" htmlFor="post-content">Content</label>
              <textarea
                id="post-content"
                className="field content-field"
                placeholder="Write your post here…"
                value={form.content}
                onChange={update("content")}
                rows={14}
                maxLength={maxLen}
                required
              />
              <span className="char-hint">
                {contentLen.toLocaleString()} / {maxLen.toLocaleString()} characters
              </span>
            </div>
          </div>

          {error && (
            <div className="error-box" style={{ marginTop: 18 }}>{error}</div>
          )}

          <div className="actions-row">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Publishing…" : "Publish post"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default CreatePostPage;