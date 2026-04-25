import { Link } from "react-router-dom";

function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 13.5S1.5 9.5 1.5 5.5a3 3 0 015.6-1.5h1.8A3 3 0 0114.5 5.5C14.5 9.5 8 13.5 8 13.5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostCard({ post }) {
  const authorName = post.author?.name || "Unknown";
  const initials = getInitials(authorName);
  const dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const excerpt = post.excerpt || post.content?.slice(0, 160) || "";

  return (
    <article className="post-card">
      <div className="card-top">
        <span className="card-eyebrow">Article</span>
        <span className="card-date">{dateStr}</span>
      </div>

      <h2 className="card-title">{post.title}</h2>

      {excerpt && <p className="card-excerpt">{excerpt}</p>}

      <div className="card-footer">
        <div className="card-author">
          {post.author?.avatarUrl ? (
            <img src={post.author.avatarUrl} alt={authorName} className="avatar avatar-img" />
          ) : (
            <div className="avatar">{initials}</div>
          )}
          <span className="card-author-name">{authorName}</span>
        </div>
        <div className="card-likes">
          <HeartIcon />
          <span>{post.likes?.length || 0}</span>
        </div>
      </div>

      <Link to={`/posts/${post._id}`} className="card-read-link">
        Read article
        <ArrowIcon />
      </Link>
    </article>
  );
}

export default PostCard;