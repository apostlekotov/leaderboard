import { JWT_SECRET } from "./../../config/index";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "./../../entities/User";

const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, country } = req.body;

    if (await User.findOne({ where: { email } }))
      return res.status(400).json({
        isSuccess: false,
        message: "User with this email is already exist",
      });

    if (await User.findOne({ where: { username } }))
      return res.status(400).json({
        isSuccess: false,
        message: "User with this username is already exist",
      });

    let user;

    const hashedPassword = await argon2.hash(password);

    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username,
          email,
          password: hashedPassword,
          country,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (err) {
      return res.status(500).json({
        isSuccess: false,
        message: "Server Error",
      });
    }

    return res.status(201).json({ isSuccess: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      where: login.includes("@") ? { email: login } : { username: login },
      select: ["id", "username", "email", "country", "score", "password"],
    });

    if (!user)
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });

    if (!(await argon2.verify(user.password, password)))
      return res.status(403).json({
        isSuccess: false,
        message: "Incorrect password",
      });

    const { password: _, ...foundUser } = user;

    const token = jwt.sign({ foundUser }, JWT_SECRET, { expiresIn: "14d" });

    return res.status(200).json({ isSuccess: true, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

export default { register, login };
