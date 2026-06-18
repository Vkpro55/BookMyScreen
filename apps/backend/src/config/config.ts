import "dotenv/config";

export const config: Readonly<{
  port: number;
  access_jwt_secret: string;
  refresh_jwt_secret: string;
  hashing_secret: string;
  email_user: string;
  email_pass: string;
  redis_host: string;
  redis_port: number;
  razorpay_key_id: string;
  razprpay_key_secret: string;
  razorpay_webhook_secret: string;
}> = {
  port: Number(process.env.PORT) || 3000,
  access_jwt_secret: process.env.ACCESS_TOKEN_SECRET ?? "",
  refresh_jwt_secret: process.env.REFRESH_TOKEN_SECRET ?? "",
  hashing_secret: process.env.HASHING_SECRET ?? "",
  email_user: process.env.EMAIL_USER ?? "",
  email_pass: process.env.EMAIL_PASS ?? "",
  redis_host: process.env.REDIS_HOST ?? "",
  redis_port: parseInt(process.env.REDIS_PORT ?? "6379"),
  razorpay_key_id: process.env.RAZORPAY_KEY_ID ?? "",
  razprpay_key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
  razorpay_webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",
};
