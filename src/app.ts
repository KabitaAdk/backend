import "./types/express";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/", testRoutes);
app.use("/api/auth", authRoutes);
app.use(errorMiddleware);

export default app;
