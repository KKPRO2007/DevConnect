import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getPosts, updateProfile } from "../lib/api";
import { getStoredToken, getStoredUser, saveAuth } from "../lib/auth";

function UserIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M2 12c0-2.2 2.2-4 5-4s5 1.8 5 4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5.5 8.5l3-3M8 3.5h2.5V6M10.5 3.5L6 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 4H3.5A1.5 1.5 0 002 5.5v5A1.5 1.5 0 003.5 12h5A1.5 1.5 0 0010 10.5V8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M4.5 6V4.5a2.5 2.5 0 015 0V6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 7.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
}

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
  const [imgError, setImgError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      if (!storedUser?.id) {
        if (!ignore) {
          setPosts([]);
          setPostsLoading(false);
        }
        return;
      }

      try {
        setPostsLoading(true);
        const data = await getPosts("", { author: storedUser.id });
        if (!ignore) {
          setPosts(data.posts || []);
          setPostsError("");
        }
      } catch (err) {
        if (!ignore) {
          setPostsError(err.message);
        }
      } finally {
        if (!ignore) {
          setPostsLoading(false);
        }
      }
    }

    loadPosts();
    return () => {
      ignore = true;
    };
  }, [storedUser?.id]);

  function update(field) {
    return (event) => {
      const value = field === "bio" ? event.target.value.slice(0, 300) : event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (field === "avatarUrl") {
        setImgError(false);
      }
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!storedUser?.id || !token) {
      setError("Login again to update your profile.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const payload = {
        name: form.name.trim(),
        bio: form.bio.trim(),
        avatarUrl: form.avatarUrl.trim(),
        ...(form.password ? { password: form.password } : {})
      };

      const data = await updateProfile(token, storedUser.id, payload);
      saveAuth(token, data.user);
      setForm((prev) => ({
        ...prev,
        name: data.user.name || "",
        bio: data.user.bio || "",
        avatarUrl: data.user.avatarUrl || "",
        password: ""
      }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!storedUser) {
    return (
      <main className="page">
        <section className="editor-shell">
          <span className="eyebrow">Profile</span>
          <h1>Profile unavailable</h1>
          <p className="editor-desc">Your session details are missing. Sign in again.</p>
        </section>
      </main>
    );
  }

  const showAvatar = Boolean(form.avatarUrl) && !imgError;
  const initials = getInitials(form.name);

  return (
    <main className="page profile-page">
      <section className="profile-topbar-card">
        <div className="profile-topbar-main">
          {showAvatar ? (
            <img
              src={form.avatarUrl}
              alt={form.name || "Profile avatar"}
              className="profile-topbar-avatar"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="profile-topbar-avatar profile-topbar-fallback">{initials}</div>
          )}

          <div className="profile-topbar-copy">
            <span className="eyebrow">Profile</span>
            <h1 className="profile-topbar-title">{form.name || "Your profile"}</h1>
            <p className="profile-topbar-meta">{storedUser.email}</p>
            <p className="profile-topbar-bio">
              {form.bio || "Add a short bio so other readers understand what you write about."}
            </p>
          </div>
        </div>

        <div className="profile-topbar-stats">
          <div className="profile-stat-box">
            <span>Posts</span>
            <strong>{posts.length}</strong>
          </div>
          
        </div>
      </section>

      <section className="profile-content-grid">
        <section className="profile-editor-card">
          <div className="panel-head">
            <h2>Edit details</h2>
            <span className="badge">You</span>
          </div>

          <form onSubmit={handleSubmit} className="profile-form-grid compact-form">
            <div className="field-item">
              <label className="field-label" htmlFor="p-name">
                Display name
              </label>
              <div className="input-wrap">
                <UserIcon />
                <input
                  id="p-name"
                  className="field has-icon"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={update("name")}
                  required
                />
              </div>
            </div>

            <div className="field-item">
              <label className="field-label" htmlFor="p-avatar">
                Avatar URL
              </label>
              <div className="input-wrap">
                <LinkIcon />
                <input
                  id="p-avatar"
                  className="field has-icon"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={form.avatarUrl}
                  onChange={update("avatarUrl")}
                />
              </div>
              {form.avatarUrl && imgError ? (
                <span className="field-hint error">Image URL could not be loaded.</span>
              ) : null}
            </div>

            <div className="field-item">
              <label className="field-label" htmlFor="p-bio">
                Bio
              </label>
              <textarea
                id="p-bio"
                className="field profile-bio-field"
                placeholder="Tell the community a little about yourself..."
                value={form.bio}
                onChange={update("bio")}
                rows={4}
              />
              <span className="field-hint">{form.bio.length} / 300 characters</span>
            </div>

            <div className="field-item">
              <label className="field-label" htmlFor="p-password">
                New password
              </label>
              <div className="input-wrap">
                <LockIcon />
                <input
                  id="p-password"
                  className="field has-icon"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  value={form.password}
                  onChange={update("password")}
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
              {form.password.length > 0 && form.password.length < 6 ? (
                <span className="field-hint error">Minimum 6 characters.</span>
              ) : null}
            </div>

            {message ? (
              <div className="success-box profile-status">
                <CheckIcon />
                {message}
              </div>
            ) : null}
            {error ? <div className="error-box">{error}</div> : null}

            <div className="actions-row compact-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        <section className="profile-posts-card">
          <div className="panel-head">
            <h2>Your posts</h2>
            <span className="badge">{posts.length}</span>
          </div>

          {postsLoading ? (
            <div className="status-box shimmer">Loading your posts...</div>
          ) : postsError ? (
            <div className="error-box">{postsError}</div>
          ) : posts.length === 0 ? (
            <div className="empty-state profile-empty-posts">
              <h3>No posts yet</h3>
              <p>Your published articles will appear here.</p>
            </div>
          ) : (
            <div className="post-grid profile-post-grid">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default ProfilePage;
