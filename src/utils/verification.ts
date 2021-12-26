import { totp } from "otplib";
import { User } from "../entities/User";

totp.options = { step: 60 * 30 };

export const generateCode = (prefix: string, userId: User["id"]) =>
  totp.generate(`${prefix}-${userId}`);

export const verifyCode = (code: string, prefix: string, userId: User["id"]) =>
  totp.verify({ token: code, secret: `${prefix}-${userId}` });
