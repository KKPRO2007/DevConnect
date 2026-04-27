const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const viewRoutes = require("./routes/viewRoutes");
const attachCurrentUser = require("./middlewares/attachCurrentUser");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Render sits behind a proxy; trust it so secure/session behavior is correct in production.
app.set("trust proxy", 1);

function normalizeOrigin(origin = "") {
  return origin.trim().replace(/\/+$/, "");
}

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
if (allowedOrigins.length > 0) {
  app.use(
    "/api",
    cors({
      origin(origin, callback) {
        const normalizedOrigin = normalizeOrigin(origin);

        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
          return callback(null, true);
        }

        return callback(new Error("CORS origin not allowed"));
      },
      credentials: true
    })
  );
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachCurrentUser);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DevConnect API is healthy"
  });
});

app.use("/", viewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
