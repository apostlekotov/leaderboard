import { NextFunction, Request, Response } from "express";

export const isPrivate = (_: Request, __: Response, next: NextFunction) => {
  next();
};
