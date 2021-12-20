import { Request, Response } from "express";

const getLeaderboard = (_: Request, res: Response) => {
  res.status(200).json({});
};

export default { getLeaderboard };
