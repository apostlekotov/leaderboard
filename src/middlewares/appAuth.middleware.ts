import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { APP_AUTH_ENABLED, APP_JWT_SECRET } from "../config";

export const appAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!APP_AUTH_ENABLED) return next();

  const token = req.headers["x-app-token"] as string;

  if (!token)
    return res.status(403).json({
      isSuccess: false,
      message: "App token is not provided",
    });

  try {
    jwt.verify(token, APP_JWT_SECRET);
  } catch (err) {
    return res.status(403).json({
      isSuccess: false,
      message: "App token is expired",
    });
  }

  return next();
};
