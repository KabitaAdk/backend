import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { HttpError } from "../errors/http-error";
import { userRepository } from "../repositories/user.repository";
import { verifyToken } from "../utils/jwt";

const getTokenFromRequest = (req: Request) => {
  const header = req.header("authorization");
  if (header && header.toLowerCase().startsWith("bearer ")) return header.slice(7).trim();
  if (req.cookies?.token && typeof req.cookies.token === "string") return req.cookies.token;
  return null;
};

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) throw new HttpError(401, "Unauthorized");

    const payload = verifyToken(token);
    if (payload.purpose !== "access") throw new HttpError(401, "Unauthorized");

    const user = await userRepository.findPublicById(payload.userId);
    if (!user) throw new HttpError(401, "Unauthorized");

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Unauthorized"));
    if (!roles.includes(req.user.role)) return next(new HttpError(403, "Forbidden"));
    return next();
  };

