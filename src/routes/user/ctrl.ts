import { Request, Response } from "express";
import { User } from "./../../entities/User";

const me = (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    return res.status(200).json({ isSuccess: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

export default { me };
