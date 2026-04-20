import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./routes/auth.route.js";
import problemRoutes from "./routes/problem.route.js";
import executionRoutes from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.route.js";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware.js";
import { AppError } from "./services/errors.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Validate CORS origin
const allowedOrigins = [];
if (process.env.FRONTEND_URL) {
  try {
    const url = new URL(process.env.FRONTEND_URL);
    allowedOrigins.push(url.origin);
  } catch {
    console.error("Invalid FRONTEND_URL:", process.env.FRONTEND_URL);
  }
}

// In development, allow localhost
if (process.env.NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:3000", "http://localhost:5173");
}

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" })); // Limit JSON payload to 1MB
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

// Apply global rate limiter
app.use(globalRateLimiter);

app.get("/", (req, res) => {
  res.send("Hello Guys Welcome to AlgoPrep🔥");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/execute-code", executionRoutes);
app.use("/api/v1/submission", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

// Global error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error caught in global handler:", err);

  // Handle AppError instances
  if (err instanceof AppError) {
    console.log("AppError detected:", err.code, err.statusCode);
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
    return;
  }

  // Handle validation errors
  if (err.message && err.message.includes("Validation failed")) {
    console.log("Validation error:", err.message);
    res.status(400).json({
      error: err.message,
      code: "VALIDATION_ERROR",
    });
    return;
  }

  // Log unexpected errors
  console.error("Unexpected error:", err);

  // Send generic error response
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
});

// 404 handler
app.use((req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    error: "Route not found",
    code: "NOT_FOUND",
    path: req.path,
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
