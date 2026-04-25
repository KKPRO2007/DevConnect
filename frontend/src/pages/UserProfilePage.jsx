import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfile } from "../lib/api";

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

function UserProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const data = await getUserProfile(id);
        if (!ignore) {
          setUser(data.user);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      }
    }

    loadUser();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) {
    return (
      <main className="page-create">
        <section className="editor-shell">
          <div className="error-box">{error}</div>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page-create">
        <section className="editor-shell">
          <div className="status-box shimmer">Loading profile...</div>
        </section>
      </main>
    );
  }

  const showAvatar = Boolean(user.avatarUrl);

  return (
    <main className="page-create">
      <section className="public-profile-card">
        <div className="public-profile-top">
          {showAvatar ? (
            <img src={user.avatarUrl} alt={user.name} className="public-profile-avatar" />
          ) : (
            <div className="public-profile-fallback">{getInitials(user.name)}</div>
          )}

          <div className="public-profile-copy">
            <span className="eyebrow">Writer</span>
            <h1>{user.name}</h1>
            <p className="public-profile-email">{user.email}</p>
          </div>
        </div>

        <div className="divider" />

        <div className="public-profile-body">
          <p className="field-label">Bio</p>
          <p className="public-profile-bio">
            {user.bio || "This writer has not added a bio yet."}
          </p>
        </div>
      </section>
    </main>
  );
}

export default UserProfilePage;
