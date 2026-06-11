import crypto from "crypto";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import type { Content } from "mailgen";
import { config } from "../../config/config.js";

export const generateOtp = () => {
  const otp = crypto.randomInt(1000, 9999);
  return otp;
};

export const hashOtp = (data: string) => {
  if (!config.hashing_secret) {
    throw new Error("Hashing secret is not found");
  }

  return crypto
    .createHmac("sha256", config.hashing_secret)
    .update(data)
    .digest("hex");
};

export const verifyOtp = (hashedOtp: string, data: string) => {
  const newHashedOtp = hashOtp(data);
  return newHashedOtp === hashedOtp;
};

const transportConfig = {
  service: "gmail",
  auth: {
    user: config.email_user,
    pass: config.email_pass,
  },
};

const transporter = nodemailer.createTransport(transportConfig);

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "bookMyScreen",
    link: "",
    logo: "https://res.cloudinary.com/amritrajmaurya/image/upload/v1751475322/zu4fnmh2jljzbtey77ah.png",
  },
});

export const sendOtpToEmail = async (email: string, otp: string) => {
  const emailTemp: Content = {
    body: {
      name: "",
      intro:
        "Welcome to bookMyScreen! We're very excited to have you on board.",
      action: {
        instructions: "To verify your account, please use the following OTP:",
        button: {
          color: "#323232",
          text: String(otp),
          link: "#",
        },
      },
      outro:
        "This OTP will expire in a short time (2 mins) for security reasons. If you did not request this OTP, please ignore this email.",
    },
  };

  const mail: string = mailGenerator.generate(emailTemp) as string;

  const message = {
    from: config.email_user,
    to: email,
    subject: "Your OTP for bookMyScreen",
    html: mail,
  };

  const info = await transporter.sendMail(message);
  return info.messageId;
};
