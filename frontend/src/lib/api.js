const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function buildHeaders(token, hasBody = false) {
  const headers = {};

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getPosts(search = "") {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/posts${query}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function registerUser(payload) {
  return request("/auth/register", {
    method: "POST",
    headers: buildHeaders(null, true),
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return request("/auth/login", {
    method: "POST",
    headers: buildHeaders(null, true),
    body: JSON.stringify(payload)
  });
}

export function getMe(token) {
  return request("/auth/me", {
    headers: buildHeaders(token)
  });
}

export function createPost(token, payload) {
  return request("/posts", {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload)
  });
}

export function toggleLike(token, id) {
  return request(`/posts/${id}/like`, {
    method: "POST",
    headers: buildHeaders(token)
  });
}

export function createComment(token, postId, payload) {
  return request(`/posts/${postId}/comments`, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload)
  });
}

export function updateProfile(token, userId, payload) {
  return request(`/users/${userId}`, {
    method: "PUT",
    headers: buildHeaders(token, true),
    body: JSON.stringify(payload)
  });
}
