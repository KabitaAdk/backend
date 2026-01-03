import jwt from "jsonwebtoken";
import { env } from "../config/env";

type TokenPurpose = "access" | "password_reset";

export type AuthTokenPayload = {
  userId: string;
  purpose: TokenPurpose;
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId, purpose: "access" } satisfies AuthTokenPayload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const generatePasswordResetToken = (userId: string) => {
  return jwt.sign({ userId, purpose: "password_reset" } satisfies AuthTokenPayload, env.jwtSecret, {
    expiresIn: env.jwtPasswordResetExpiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
};

// Backwards compatibility
export const generateToken = generateAccessToken;
