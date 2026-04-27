function notFound(req, res) {
  if (!req.originalUrl.startsWith("/api/") && req.accepts("html")) {
    return res.status(404).render("pages/error", {
      pageTitle: "Page Not Found",
      heading: "Page not found",
      message: `Route not found: ${req.originalUrl}`
    });
  }

  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
}

module.exports = notFound;
