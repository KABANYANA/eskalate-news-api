import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { SignupInput } from "../validators/auth.validator";

export const registerUser = async (data: SignupInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role
    }
  });

  return user;
};