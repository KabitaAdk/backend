import { Router } from "express";
import { register, login, getallUser, getsingleUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
//router.get("/users", getallUser);
router.post("/login", login);
//router.get("/user", getsingleUser);

export default router;