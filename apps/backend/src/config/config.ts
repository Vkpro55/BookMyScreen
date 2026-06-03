import "dotenv/config";

export const config: Readonly<{
  port: number;
}> = {
  port: Number(process.env.PORT) || 3000,
};
