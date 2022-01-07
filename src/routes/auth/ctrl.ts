import { Request, Response } from "express";
import { getConnection } from "typeorm";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { User } from "../../entities/User";
import {
  APP_JWT_SECRET,
  GEN_APP_AUTH_ENABLED,
  JWT_SECRET,
} from "../../config/index";

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

    const { password: _, ...createdUser } = user;

    const token = jwt.sign({ user: { ...createdUser } }, JWT_SECRET, {
      expiresIn: "14d",
    });

    return res.status(201).json({ isSuccess: true, user: createdUser, token });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({
      where: login.includes("@") ? { email: login } : { username: login },
      select: [
        "id",
        "username",
        "email",
        "isVerifiedEmail",
        "country",
        "score",
        "pb",
        "password",
        "createdAt",
      ],
    });

    if (!user)
      return res.status(404).json({
        isSuccess: false,
        message: "User is not found",
      });

    if (!(await argon2.verify(user.password, password)))
      return res.status(403).json({
        isSuccess: false,
        message: "Incorrect password",
      });

    const { password: _, ...loggedUser } = user;

    const token = jwt.sign({ user: { ...loggedUser } }, JWT_SECRET, {
      expiresIn: "14d",
    });

    return res.status(200).json({ isSuccess: true, user: loggedUser, token });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const getAppToken = async (_: Request, res: Response) => {
  if (!GEN_APP_AUTH_ENABLED)
    return res.status(405).json({ isSuccess: false, message: "Not allowed" });

  const token = jwt.sign({}, APP_JWT_SECRET, { expiresIn: "1d" });

  return res.status(200).json({ isSuccess: true, token });
};

export default { register, login, getAppToken };
