import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http-error";
import { userRepository } from "../repositories/user.repository";
import { env } from "../config/env";
import { generateAccessToken } from "../utils/jwt";
import { generateOtp, getOtpExpiryDate, hashOtp, isExpired } from "../utils/otp";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const assertPassword = (password: string) => {
  if (password.length < 8) throw new HttpError(400, "password must be at least 8 characters");
};

export const authService = {
  register: async (input: { name: string; email: string; password: string; role?: Role }) => {
    const name = input.name.trim();
    const email = normalizeEmail(input.email);
    const password = input.password;

    if (!name) throw new HttpError(400, "name is required");
    if (!email) throw new HttpError(400, "email is required");
    assertPassword(password);

    const existing = await userRepository.findPublicByEmail(email);
    if (existing) throw new HttpError(409, "Email already registered");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({
      name,
      email,
      passwordHash,
      role: input.role ?? Role.USER,
    });

    const token = generateAccessToken(user.id);
    return { user, token };
  },

  login: async (input: { email: string; password: string }) => {
    const email = normalizeEmail(input.email);
    const password = input.password;

    if (!email) throw new HttpError(400, "email is required");
    if (!password) throw new HttpError(400, "password is required");

    const user = await userRepository.findAuthByEmail(email);
    if (!user) throw new HttpError(401, "Invalid credentials");

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw new HttpError(401, "Invalid credentials");

    const token = generateAccessToken(user.id);
    const { password: _password, ...publicUser } = user;
    return { user: publicUser, token };
  },

  requestPasswordReset: async (input: { email: string }) => {
    const email = normalizeEmail(input.email);
    if (!email) throw new HttpError(400, "email is required");

    const user = await userRepository.findPublicByEmail(email);
    if (!user) {
      return { message: "If an account exists, an OTP has been sent" };
    }

    const otp = generateOtp(6);
    const expiresAt = getOtpExpiryDate(env.otpTtlMinutes);
    await userRepository.setPasswordResetOtp(user.id, hashOtp(otp), expiresAt);

    return {
      message: "If an account exists, an OTP has been sent",
      ...(env.returnOtpInResponse ? { otp } : {}),
    };
  },

  verifyOtpAndResetPassword: async (input: { email: string; otp: string; newPassword: string }) => {
    const email = normalizeEmail(input.email);
    const otp = input.otp.trim();
    const newPassword = input.newPassword;

    if (!email || !otp || !newPassword) {
      throw new HttpError(400, "email, otp and newPassword are required");
    }
    assertPassword(newPassword);

    const user = await userRepository.findForPasswordResetByEmail(email);
    if (!user || !user.passwordResetOtpHash) throw new HttpError(400, "Invalid or expired OTP");
    if (isExpired(user.passwordResetOtpExpiresAt)) throw new HttpError(400, "Invalid or expired OTP");
    if (hashOtp(otp) !== user.passwordResetOtpHash) throw new HttpError(400, "Invalid or expired OTP");

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await userRepository.updatePasswordAndClearPasswordReset(user.id, passwordHash);

    const token = generateAccessToken(user.id);
    const { passwordResetOtpHash: _h, passwordResetOtpExpiresAt: _e, ...publicUser } = user;
    return { message: "Password reset successful", user: publicUser, token };
  },
};
