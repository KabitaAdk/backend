import { Router } from "express";
import {hello, addQuery, addBody } from "../controllers/test.controller";

const router = Router();

router.get("/hello", hello);
router.get("/add", addQuery);
router.post("/", addBody);
router.get("/", (req, res) => {
    res.send("Test route is working");
});

export default router;