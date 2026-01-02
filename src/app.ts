import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import { getallUser } from "./controllers/auth.controller";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:true,
    credentials: true,
  })
);

app.use("/", testRoutes);
app.use("/api/auth", authRoutes);
app.get("/users", getallUser);

export default app;
