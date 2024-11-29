import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

type budget = {
    category: string;
    maximum: number;
    theme: string;
    spent: number;
    categoryId: number
    budgetId:number
  };

export const createbudget: controller = async (req, res) => {
    const {categoryId, category, maximum, theme }: budget = req.body;
    //@ts-expect-error middleware
    const userId = req.user;
  
    const newBudget = await prisma.budgets.create({
      data: {
        categoryId:categoryId,
        maximum: Number(maximum),
        theme: theme,
        spent: 0,
        userId: userId,
        category: category,
      },
    });
    if (!newBudget.budgetId) {
      return res.end("An error has occured, Budget was not created");
    }
  
    return res.status(200).json({ success: true, message: "Budget created" });
  };