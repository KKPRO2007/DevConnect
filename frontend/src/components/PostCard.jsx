import { Link } from "react-router-dom";

function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="card-topline" />
      <p className="label">Article</p>
      <h2>{post.title}</h2>
      <p className="card-copy">{post.excerpt || post.content.slice(0, 160)}</p>
      <div className="card-meta">
        <span>{post.author?.name || "Unknown author"}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <Link to={`/posts/${post._id}`} className="inline-link">
        Open post
      </Link>
    </article>
  );
}

export default PostCard;
