function normalizeApiUrl(url) {
  const normalized = url.replace(/\/+$/, "");
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function getApiConfigError(configuredUrl) {
  if (!configuredUrl) {
    return "API is not configured. Set VITE_API_URL to your Render backend URL (for example: https://your-app.onrender.com).";
  }

  if (typeof window !== "undefined") {
    const apiHostname = getHostname(configuredUrl);
    const appHostname = window.location.hostname;

    if (apiHostname && appHostname && apiHostname === appHostname) {
      return "VITE_API_URL is pointing to the frontend domain. Set it to your Render backend URL (for example: https://your-app.onrender.com).";
    }
  }

  return "API request could not be created due to an invalid VITE_API_URL value.";
}

function getApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    const normalizedUrl = normalizeApiUrl(configuredUrl);

    if (typeof window !== "undefined") {
      const apiHostname = getHostname(normalizedUrl);
      const appHostname = window.location.hostname;

      if (apiHostname && appHostname && apiHostname === appHostname) {
        return null;
      }
    }

    return normalizedUrl;
  }

  if (typeof window !== "undefined") {
    const { hostname } = window.location;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }

    return null;
  }

  return "http://localhost:5000/api";
}

const API_URL = getApiUrl();
const API_CONFIG_ERROR = getApiConfigError(import.meta.env.VITE_API_URL?.trim());

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
  if (!API_URL) {
    throw new Error(API_CONFIG_ERROR);
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, options);
  } catch (error) {
    throw new Error("Server is unavailable right now. Please try again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function getPosts(search = "", options = {}) {
  const params = new URLSearchParams();
  if (search) {
    params.set("search", search);
  }
  if (options.author) {
    params.set("author", options.author);
  }

  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/posts${query}`);
}

export function getPost(id) {
  return request(`/posts/${id}`);
}

export function getUserStats() {
  return request("/users/stats");
}

export function getUsers() {
  return request("/users");
}

export function getUserProfile(id) {
  return request(`/users/${id}`);
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
