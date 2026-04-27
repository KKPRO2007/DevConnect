function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (res.headersSent) {
    return next(err);
  }

  if (!req.originalUrl.startsWith("/api/") && req.accepts("html")) {
    return res.status(statusCode).render("pages/error", {
      pageTitle: "Something went wrong",
      heading: statusCode === 404 ? "Page not found" : "Something went wrong",
      message
    });
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
}

module.exports = errorHandler;
