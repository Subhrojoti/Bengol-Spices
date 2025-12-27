import nodemailer from "nodemailer";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyMail = async (token, email) => {
  const emailTempletSource = fs.readFileSync(
    path.join(__dirname, "template.hbs"),
    "utf-8"
  );

  const template = handlebars.compile(emailTempletSource);
  const htmlToSend = template({ token: encodeURIComponent(token) });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",
      html: htmlToSend,
    };

    await transporter.sendMail(mailConfigurations);
    console.log("Verification email sent");
  } catch (error) {
    throw new Error(error.message);
  }
};
