function isPageRequest(req) {
  return !req.originalUrl.startsWith("/api/") && req.accepts("html");
}

function buildPageRedirect(path, options = {}) {
  const { error = "", success = "", formValues = {} } = options;
  const params = new URLSearchParams();

  if (error) {
    params.set("error", error);
  }

  if (success) {
    params.set("success", success);
  }

  Object.entries(formValues).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

module.exports = {
  isPageRequest,
  buildPageRedirect
};
