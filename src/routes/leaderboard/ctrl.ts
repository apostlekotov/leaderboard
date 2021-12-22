import { Request, Response } from "express";

const getLeaderboard = (_: Request, res: Response) => {
  try {
    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

export default { getLeaderboard };
