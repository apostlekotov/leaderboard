import { Request, Response } from "express";

const register = (_: Request, res: Response) => {
  res.status(200).json({});
};

const login = (_: Request, res: Response) => {
  res.status(200).json({});
};

export default { register, login };
