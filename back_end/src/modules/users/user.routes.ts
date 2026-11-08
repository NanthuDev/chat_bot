import { Router } from "express";

import {
  authenticate,
  type AuthRequest,
} from "../../middleware/authenticate.js";
import { prisma } from "../../../config/database.js";

const router = Router();

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const userId = (req as AuthRequest).user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });

      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
