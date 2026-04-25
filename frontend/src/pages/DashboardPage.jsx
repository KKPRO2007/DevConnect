import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { getPosts, getUserStats, getUsers } from "../lib/api";

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function getInitials(name = "") {
  return (
    name.trim().split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?"
  );
}

function DashboardPage() {
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);
        const [postsData, statsData, usersData] = await Promise.all([
          getPosts(search),
          getUserStats(),
          getUsers(),
        ]);

        if (!ignore) {
          setPosts(postsData.posts || []);
          setTotalUsers(statsData.totalUsers || 0);
          setUsers(usersData.users || []);
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

    loadData();
    return () => { ignore = true; };
  }, [search]);

  return (
    <main className="page dashboard-page">
      <div className="dash-header">
        <div className="dash-title-block">
          <span className="eyebrow">Editorial space</span>
          <h1 className="dash-h1">DevConnect</h1>
          <p className="dash-tagline">A space to share what you’re creating and learning.</p>
        </div>
        <div className="dash-counters">
          <div className="dash-counter">
            <strong>{loading ? "-" : posts.length}</strong>
            <span>Posts</span>
          </div>
          <div className="dash-counter-sep" />
          <div className="dash-counter">
            <strong>{loading ? "-" : totalUsers}</strong>
            <span>Writers</span>
          </div>
        </div>
      </div>

      {users.length > 0 && (
        <div className="writers-bar">
          <span className="writers-bar-label">Writers</span>
          <div className="writers-chips-track">
            {users.map((user) => (
              <Link key={user.id} to={`/users/${user.id}`} className="writer-chip">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="writer-chip-avatar" />
                ) : (
                  <div className="writer-chip-avatar writer-chip-fallback">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="writer-chip-name">{user.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="dash-filter-row">
        <div className="search-wrap dash-search-wrap">
          <SearchIcon />
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
          />
        </div>
        {!loading && (
          <span className="section-label" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        )}
      </div>

      {loading && (
        <div className="status-box shimmer" style={{ marginBottom: 14 }}>Loading...</div>
      )}
      {error && (
        <div className="error-box" style={{ marginBottom: 14 }}>{error}</div>
      )}

      <section className="post-grid">
        {!loading && !error && posts.length === 0 && (
          <div className="empty-state">
            <h3>No posts yet</h3>
            <p>Be the first write something from the Write screen.</p>
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