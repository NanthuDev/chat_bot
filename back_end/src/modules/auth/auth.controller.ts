import type { Request, Response, NextFunction } from "express";

import { AuthService } from "./auth.service.js";

import { registerSchema, loginSchema } from "./auth.validation.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);

      const user = await authService.register(input);

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);

      const result = await authService.login(input);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
