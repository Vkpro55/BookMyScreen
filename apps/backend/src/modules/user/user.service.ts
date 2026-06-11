import prisma from "@repo/db/client";
import type { User } from "@repo/db/client";
import type { UserInput } from "./user.types.js";

export const createUser = async (data: UserInput): Promise<User> => {
  return await prisma.user.create({
    data,
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const activateUser = async (
  id: string,
  data: Partial<User>,
): Promise<User | null> => {
  return prisma.user.update({
    where: { id },
    data,
  });
};
