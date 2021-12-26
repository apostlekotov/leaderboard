import { NextFunction, Request, Response } from "express";

export const notFound = async (_: Request, res: Response, __: NextFunction) =>
  res.status(404).send("Resource not found");
