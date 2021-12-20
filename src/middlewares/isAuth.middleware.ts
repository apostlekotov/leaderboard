import { NextFunction, Request, Response } from "express";

export const isAuth = (_: Request, __: Response, next: NextFunction) => {
  next();
};
