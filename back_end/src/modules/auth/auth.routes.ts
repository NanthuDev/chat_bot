import { Router } from "express";

import { AuthController } from "./auth.controller.js";

const router = Router();

const controller = new AuthController();

router.post("/register", controller.register.bind(controller));

router.post("/login", controller.login.bind(controller));

export default router;
