import { Request, Response } from "express";

const me = (_: Request, res: Response) => {
  res.status(200).json({});
};

export default { me };
