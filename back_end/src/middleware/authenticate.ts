import type { Request, Response, NextFunction } from "express";

import { jwtVerify } from "jose";

import { env } from "../../config/env.js";
import { AppError } from "../shared/errors/app-error.js";

const secret = new TextEncoder().encode(env.JWT_SECRET);

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication required");
    }

    const token = authorization.slice(7);

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
      throw new AppError(401, "Invalid authentication token");
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(401, "Invalid or expired token"));
    }
  }
}
