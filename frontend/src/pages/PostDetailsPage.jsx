import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createComment, getPost, toggleLike } from "../lib/api";
import { getStoredToken, getStoredUser } from "../lib/auth";

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 13.5S1.5 9.5 1.5 5.5a3 3 0 015.6-1.5h1.8A3 3 0 0114.5 5.5C14.5 9.5 8 13.5 8 13.5z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 12c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="2.5" width="11" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 6h11" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 1v3M9 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function PostDetailsPage() {
  const { id } = useParams();
  const token = getStoredToken();
  const user = getStoredUser();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPost() {
      try {
        const data = await getPost(id);
        if (!ignore) {
          setPost(data.post);
          setComments(data.comments || []);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      }
    }

    loadPost();
    return () => { ignore = true; };
  }, [id]);

  async function handleLike() {
    if (!token) { setError("Login to like posts."); return; }
    try {
      setBusy(true);
      await toggleLike(token, id);
      const refreshed = await getPost(id);
      setPost(refreshed.post);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!token) { setCommentError("Login to post a comment."); return; }
    if (!content.trim()) { setCommentError("Comment cannot be empty."); return; }
    try {
      setBusy(true);
      const data = await createComment(token, id, { content });
      setComments([data.comment, ...comments]);
      setContent("");
      setCommentError("");
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !post) {
    return (
      <main className="page">
        <div className="error-box">{error}</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page">
        <div className="status-box shimmer">Loading post…</div>
      </main>
    );
  }

  const likedByUser = user && post.likes?.some((likeId) => likeId === user.id);
  const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="page-detail">
      {/* ── Feature Post ── */}
      <article className="feature-post">
        <span className="eyebrow">Post</span>
        <h1>{post.title}</h1>

        <div className="post-meta-row">
          <span className="post-meta-item">
            <UserIcon />
            {post.author?.name || "Unknown author"}
          </span>
          <span className="post-meta-item">
            <CalendarIcon />
            {dateStr}
          </span>
          <span className="post-meta-item">
            <HeartIcon />
            {post.likes?.length || 0} likes
          </span>
        </div>

        {post.excerpt && (
          <p className="post-excerpt-box">{post.excerpt}</p>
        )}

        <p className="post-content-body">{post.content}</p>

        {(post.tags || []).length > 0 && (
          <div className="chip-strip">
            {post.tags.map((tag) => (
              <span className="chip" key={tag}>{tag}</span>
            ))}
          </div>
        )}

        {error && (
          <div className="error-box" style={{ marginBottom: 14 }}>{error}</div>
        )}

        <button
          type="button"
          className={`like-btn${likedByUser ? " liked" : ""}`}
          onClick={handleLike}
          disabled={busy}
        >
          <HeartIcon filled={likedByUser} />
          {likedByUser ? "Unlike" : "Like"} post
        </button>
      </article>

      {/* ── Comments ── */}
      <section className="comment-panel">
        <div className="panel-head">
          <h2>Comments</h2>
          <span className="badge">{comments.length}</span>
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            className="comment-textarea"
            placeholder="Write a thoughtful reply…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          {commentError && (
            <div className="error-box">{commentError}</div>
          )}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? "Sending…" : "Post comment"}
          </button>
        </form>

        <div className="comment-list">
          {comments.length === 0 && (
            <div className="status-box">No comments yet. Be first.</div>
          )}
          {comments.map((comment) => {
            const cDate = new Date(comment.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            return (
              <article className="comment-card" key={comment._id}>
                <p className="comment-body">{comment.content}</p>
                <div className="comment-foot">
                  <div className="comment-author">
                    <div className="avatar">
                      {getInitials(comment.author?.name)}
                    </div>
                    {comment.author?.name || "Unknown user"}
                  </div>
                  <span className="comment-date">{cDate}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default PostDetailsPage;