import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is not set`);
  return value;
};

const parseIntEnv = (key: string, fallback: number) => {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseIntEnv("PORT", 3000),

  databaseUrl: requireEnv("DATABASE_URL"),

  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
  jwtPasswordResetExpiresIn: process.env.JWT_PASSWORD_RESET_EXPIRES_IN ?? "15m",

  otpTtlMinutes: parseIntEnv("OTP_TTL_MINUTES", 10),
  returnOtpInResponse:
    process.env.RETURN_OTP_IN_RESPONSE === "true" || (process.env.NODE_ENV ?? "development") !== "production",
} as const;

