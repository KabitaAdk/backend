import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { HttpError } from "../errors/http-error";
import { userRepository } from "../repositories/user.repository";
import { generateAccessToken } from "../utils/jwt";

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
};
