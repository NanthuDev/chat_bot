import type { ErrorRequestHandler } from "express";
import { AppError } from "../shared/errors/app-error.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  console.error("Application error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
