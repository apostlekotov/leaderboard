import nodemailer from "nodemailer";
import { EMAIL, NODE_ENV, PASSWORD } from "../config";

export const sendEmail = async (
  email: string,
  subject: string,
  text: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  const message = await transporter.sendMail({
    from: "Pechkin <postman.igor.pechkin@gmail.com>",
    to: email,
    subject,
    html: text,
    text,
  });

  console.log(`Mail sent: ${message.messageId}`);
  NODE_ENV === "development" && console.log(`Mail body: ${text}`);
};
