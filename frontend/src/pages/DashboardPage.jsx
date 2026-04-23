import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getPosts } from "../lib/api";

function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      try {
        setLoading(true);
        const data = await getPosts(search);
        if (!ignore) {
          setPosts(data.posts || []);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPosts();
    return () => {
      ignore = true;
    };
  }, [search]);

  return (
    <main className="page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="label">Black edition</p>
          <h1>Quiet, sharp, developer-focused publishing.</h1>
          <p className="hero-text">
            DevConnect keeps the interface minimal, lets content breathe, and
            still gives you auth, writing, comments, likes, and search.
          </p>
        </div>

        <div className="stat-stack">
          <div className="metric-card">
            <span>Posts</span>
            <strong>{posts.length}</strong>
          </div>
          <div className="metric-card">
            <span>Style</span>
            <strong>Dark Mono</strong>
          </div>
        </div>
      </section>

      <section className="toolbar">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search posts by title or content"
        />
      </section>

      {loading && <p className="state-text">Loading posts...</p>}
      {error && <p className="state-text error">{error}</p>}

      <section className="post-list">
        {!loading && !posts.length && !error && (
          <div className="empty-panel">
            <h2>No posts yet</h2>
            <p>Create the first story from the write screen after login.</p>
          </div>
        )}
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </section>
    </main>
  );
}

export default DashboardPage;
