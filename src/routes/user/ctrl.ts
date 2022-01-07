import { Request, Response } from "express";
import argon2 from "argon2";
import { User } from "../../entities/User";
import { generateCode, verifyCode } from "../../utils/verification";
import { sendEmail } from "../../utils/sendEmail";

const me = (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    return res.status(200).json({ isSuccess: true, user });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  const userId: User["id"] = req.params.id;
  const code: string = req.body.code;

  const user = await User.findOne(userId);

  if (!user)
    return res.status(404).json({
      isSuccess: false,
      message: "User is not found",
    });

  if (!code) {
    sendEmail(
      user.email,
      "Email verification",
      `${generateCode("verify-email", userId)}`
    );

    return res.status(200).json({
      isSuccess: true,
      message: "Verification email was sent",
    });
  }

  const isVerifiedEmail = verifyCode(code, "verify-email", userId);

  if (!isVerifiedEmail)
    return res.status(403).json({
      isSuccess: false,
      message: "Invalid code",
    });

  await User.update({ id: userId }, { isVerifiedEmail });

  return res.status(200).json({
    isSuccess: true,
    message: "Email was successfully verified",
  });
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const login: string = req.params.login;
    const newPassword: string = req.body.password;
    const code: string = req.body.code;

    const user = await User.findOne({
      where: login.includes("@") ? { email: login } : { username: login },
      select: ["id", "username", "email", "country", "score", "password"],
    });

    if (!user)
      return res.status(404).json({
        isSuccess: false,
        message: "User is not found",
      });

    if (!code && !newPassword) {
      sendEmail(
        user.email,
        "Reset password",
        `${generateCode("reset-password", user.id)}`
      );

      return res.status(200).json({
        isSuccess: true,
        message: "Reset password email was sent",
      });
    }

    if (!verifyCode(code, "reset-password", user.id))
      return res.status(403).json({
        isSuccess: false,
        message: "Invalid code",
      });

    const hashedPassword = await argon2.hash(newPassword);

    await User.update({ id: user.id }, { password: hashedPassword });

    return res.status(200).json({
      isSuccess: true,
      message: "User`s password was successfully updated",
    });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;
    const score: number | undefined = req.body?.score;
    const avatar: number | undefined = req.body?.avatar;

    const updatedData: { score?: number; avatar?: number } = {};

    if (score) updatedData.score = score;
    if (avatar) updatedData.avatar = avatar;

    await User.update({ id: user.id }, updatedData);

    return res.status(200).json({
      isSuccess: true,
      message: "User was successfully updated",
    });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user;

    await User.delete(user.id);

    return res.status(200).json({
      isSuccess: true,
      message: "User was successfully deleted",
    });
  } catch (err) {
    console.error(`Error: ${err}`.red);
    return res.status(500).json({ isSuccess: false, message: "Server Error" });
  }
};

export default { me, verifyEmail, resetPassword, updateUser, deleteUser };
