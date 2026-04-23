import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createComment, getPost, toggleLike } from "../lib/api";
import { getStoredToken, getStoredUser } from "../lib/auth";

function PostDetailsPage() {
  const { id } = useParams();
  const token = getStoredToken();
  const user = getStoredUser();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
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
        if (!ignore) {
          setError(err.message);
        }
      }
    }

    loadPost();
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleLike() {
    if (!token) {
      setError("Login to like posts");
      return;
    }

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

  async function handleCommentSubmit(event) {
    event.preventDefault();

    if (!token) {
      setError("Login to comment");
      return;
    }

    try {
      setBusy(true);
      const data = await createComment(token, id, { content });
      setComments([data.comment, ...comments]);
      setContent("");
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (error && !post) {
    return (
      <main className="page">
        <p className="state-text error">{error}</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page">
        <p className="state-text">Loading post...</p>
      </main>
    );
  }

  const likedByUser = user && post.likes?.some((likeId) => likeId === user.id);

  return (
    <main className="page detail-page">
      <article className="feature-post">
        <p className="label">Post</p>
        <h1>{post.title}</h1>
        <div className="detail-meta">
          <span>{post.author?.name || "Unknown author"}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <span>{post.likes?.length || 0} likes</span>
        </div>
        <p className="feature-copy">{post.content}</p>
        <div className="chip-row">
          {(post.tags || []).map((tag) => (
            <span className="chip" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <button type="button" onClick={handleLike} disabled={busy}>
          {likedByUser ? "Unlike post" : "Like post"}
        </button>
      </article>

      <section className="comment-panel">
        <div className="section-heading">
          <h2>Comments</h2>
          <span>{comments.length}</span>
        </div>

        <form onSubmit={handleCommentSubmit} className="form-grid">
          <textarea
            placeholder="Write a thoughtful reply"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          {error && <p className="state-text error">{error}</p>}
          <button type="submit" disabled={busy}>
            {busy ? "Sending..." : "Add comment"}
          </button>
        </form>

        <div className="comment-list">
          {comments.map((comment) => (
            <article className="comment-card" key={comment._id}>
              <p>{comment.content}</p>
              <div className="card-meta">
                <span>{comment.author?.name || "Unknown user"}</span>
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PostDetailsPage;
