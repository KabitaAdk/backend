import crypto from "crypto";

export const generateOtp = (digits = 6) => {
  const max = 10 ** digits;
  return crypto.randomInt(0, max).toString().padStart(digits, "0");
};

export const hashOtp = (otp: string) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const getOtpExpiryDate = (ttlMinutes: number) => {
  return new Date(Date.now() + ttlMinutes * 60 * 1000);
};

export const isExpired = (expiresAt: Date | null | undefined) => {
  if (!expiresAt) return true;
  return expiresAt.getTime() < Date.now();
};

