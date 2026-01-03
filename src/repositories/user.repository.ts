import type { Role } from "@prisma/client";
import prisma from "../lib/prisma";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
};

type UserWithPassword = PublicUser & { password: string };
type UserForPasswordReset = PublicUser & {
  passwordResetOtpHash: string | null;
  passwordResetOtpExpiresAt: Date | null;
};

export const userRepository = {
  findPublicByEmail: async (email: string): Promise<PublicUser | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  findAuthByEmail: async (email: string): Promise<UserWithPassword | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, createdAt: true, password: true },
    });
  },

  findPublicById: async (id: string): Promise<PublicUser | null> => {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  create: async (data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<PublicUser> => {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: data.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  },

  findForPasswordResetByEmail: async (email: string): Promise<UserForPasswordReset | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        passwordResetOtpHash: true,
        passwordResetOtpExpiresAt: true,
      },
    });
  },

  setPasswordResetOtp: async (userId: string, otpHash: string, expiresAt: Date) => {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordResetOtpHash: otpHash, passwordResetOtpExpiresAt: expiresAt },
      select: { id: true },
    });
  },

  updatePasswordAndClearPasswordReset: async (userId: string, passwordHash: string) => {
    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash, passwordResetOtpHash: null, passwordResetOtpExpiresAt: null },
      select: { id: true },
    });
  },
};
