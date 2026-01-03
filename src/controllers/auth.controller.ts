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

<<<<<<< HEAD
  const result = await authService.login({
    email: email ?? "",
    password: password ?? "",
  });

  res.cookie("token", result.token, authCookieOptions);
  res.json(result);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body as { email?: string };

  const result = await authService.requestPasswordReset({ email: email ?? "" });

  if ("otp" in result && typeof result.otp === "string") {
    // eslint-disable-next-line no-console
    console.log(`[auth] Password reset OTP for ${email}: ${result.otp}`);
  }

  res.json(result);
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body as {
    email?: string;
    otp?: string;
    newPassword?: string;
  };

  const result = await authService.verifyOtpAndResetPassword({
    email: email ?? "",
    otp: otp ?? "",
    newPassword: newPassword ?? "",
  });

  res.cookie("token", result.token, authCookieOptions);
  res.json(result);
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  res.json({ user: req.user });
});

export const adminOnly = asyncHandler(async (_req: Request, res: Response) => {
  res.json({ message: "ok" });
});
=======
    res.json({message: "Login successful"});
};

export const getallUser = async (req:Request, res:Response) => {
    const users = await prisma.user.findMany({});
    res.json({message: "User fetch successfully", data:users} );
}

export const getsingleUser = async (req:Request, res:Response) => {
    const { email } = req.params;
    const user = await prisma.user.findUnique({
        where: {
            email: String(email),
        }
    });
    if (!user){
        return res.status(404).json({message: "User not found"});
    }
    res.json({message: "User fetched cuccessfully", data: user});
}
>>>>>>> 887ab8b9f948cfc09222805b60cc8f03ffbf0ed6
