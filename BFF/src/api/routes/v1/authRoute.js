import { Router } from "express";
import * as authController from "../../controllers/v1/authController.js";
import { jwtParser } from "../../../middleware/jwtParser.js";

const router = Router();

router.post("/login", authController.loginUser);
router.post("/refresh", authController.refreshUserTokens);
router.post("/logout", authController.logoutUser);

router.get("/status", jwtParser, authController.checkAuthStatus);

export default router;
