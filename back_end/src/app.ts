import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "../config/env.js";
import { errorHandler } from "./middleware/error-handler.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";

const app = express();

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);

// JSON request parser
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Chatbot backend is running",
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);

export { app };
