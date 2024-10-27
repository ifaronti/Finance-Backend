import { PrismaClient } from "@prisma/client";
import { Response, Request } from "express";
import bcryptjs from "bcryptjs";
import * as data from "../../../data.json";
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
  const { email, name, password, income, avatar, balance }: reqBody =
    req.body;
  const salt = await bcryptjs.genSalt(10);
  const hashed = await bcryptjs.hash(password, salt);

  const user = await prisma.user.create({
    data: { email, income, avatar, name, password: hashed, balance },
  });

  if (!user.id) {
    return res.end("User not created, please try again");
  }

  const placeHolderTransactions = data.transactions.map((item) => {
    item.userId = user.id;
    return item;
  });

  const placeHolderBudgets = data.budgets.map((item) => {
    item.userId = user.id;
    return item;
  });

  const placeHolderPots = data.pots.map((item) => {
    item.userId = user.id;
    return item;
  });

  const placeHolderBills = data.recurringBills.map((item) => {
    item.userId = user.id;
    return item;
  });

  await prisma.transactions.createMany({ data: placeHolderTransactions });
  await prisma.pot.createMany({ data: placeHolderPots });
  await prisma.budget.createMany({ data: placeHolderBudgets });
  await prisma.bills.createMany({ data: placeHolderBills });

  return res
    .status(200)
    .json({ message: "user created successfully", success: true });
};
