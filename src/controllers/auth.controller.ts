import type { CookieOptions, Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";
import { env } from "../config/env";

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  const result = await authService.register({
    name: name ?? "",
    email: email ?? "",
    password: password ?? "",
  });

  res.cookie("token", result.token, authCookieOptions);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };

  const result = await authService.login({
    email: email ?? "",
    password: password ?? "",
  });

  res.cookie("token", result.token, authCookieOptions);
  res.json(result);
});

