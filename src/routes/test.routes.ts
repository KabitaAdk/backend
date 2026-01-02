import { Router } from "express";
import {hello, addQuery, addBody } from "../controllers/test.controller";

const router = Router();

router.get("/hello", hello);
router.get("/add", addQuery);
router.post("/", addBody);

export default Router;