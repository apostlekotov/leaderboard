import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./../config";
import { User } from "./../entities/User";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization)
    return res.status(403).json({
      isSuccess: false,
      message: "Authorization token is not provided",
    });

  const token = req.headers.authorization.split(" ")[1];

  if (!token)
    return res.status(401).json({
      isSuccess: false,
      message: "Authorization token type is not specified",
    });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const user = await User.findOne(payload.id, {
      select: ["id", "username", "email", "country", "score"],
    });

    if (!user)
      return res.status(401).json({
        isSuccess: false,
        message: "User not found",
      });

    req.body.user = user;
  } catch (err) {
    return res.status(403).json({
      isSuccess: false,
      message: "Authorization token is expired",
    });
  }

  return next();
};
