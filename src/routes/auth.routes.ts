import { Router } from "express";
import { register, login, getallUser } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
//router.get("/users", getallUser);
router.post("/login", login);


export default router;