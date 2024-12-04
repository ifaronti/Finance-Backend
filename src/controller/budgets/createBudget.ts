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
  const max = Number(maximum)
  
  const newBudget:budget = await prisma.$queryRaw`
      INSERT INTO budgets ("categoryId", maximum, theme, spent, "userId", category)
      VALUES (
        ${categoryId},
        ${max},
        ${theme},
        (SELECT SUM(t.amount) FROM transactions t WHERE t."userId" = ${userId} AND t.category = ${category} AND EXTRACT(MONTH FROM t.date) > 7 AND position('-' IN t.amount::text)>0),
        ${userId},
        ${category}
      )
    `
    if (!newBudget.budgetId) {
      return res.end("An error has occured, Budget was not created");
    }
  
    return res.status(200).json({ success: true, message: "Budget created" });
  };