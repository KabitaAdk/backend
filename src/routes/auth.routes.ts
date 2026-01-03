import { Router } from "express";
import { Role } from "@prisma/client";
import { adminOnly, forgotPassword, login, me, register, verifyOtp } from "../controllers/auth.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.get("/me", authenticate, me);
router.get("/admin", authenticate, authorizeRoles(Role.ADMIN), adminOnly);

export default router;
