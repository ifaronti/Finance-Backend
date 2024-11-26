import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bcryptjs from "bcryptjs";
import { populateUserData } from "../../support/placeHolder";
import * as placeholderData from '../../data.json'
const prisma = new PrismaClient();

export type controller = (req: Request, res: Response) => void;

type reqBody = {
  email: string;
  name: string;
  password: string;
  income: number;
  avatar: string;
  expenses: number;
  balance: number;
};

export const Register: controller = async (req, res) => {
  const { email, name, password, avatar}: reqBody =req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password, salt);
  const {current, income, expenses} = placeholderData.balance

  const user = await prisma.user.create({
    data: { email, avatar, expenses, income, name, password: hashed, balance:current },
  });

  if (!user.id) {
    return res.end("User not created, please try again");
  }

  await populateUserData(user.id)
  return res
    .status(200)
    .json({ message: "user created successfully", success: true });
};
