import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/auth.controller";

const prisma = new PrismaClient();

type budget = {
  category: string;
  maximum: number;
  theme: string;
  spent: number;
  categoryId: number
  budgetId:number
};
type updateBody = {
  budget: budget;
};

export const updateBudget: controller = async (req, res) => {
    const { budget }: updateBody = req.body;
    //@ts-expect-error middleware
    const userId = req.user;
    const maximum = Number(budget.maximum)
    if (!budget) {
      return res.end("Retrieval parameters are required");
    }
  
    const budgetUpdate = await prisma.budget.update({
      where: {
        userId: userId,
        budgetId: Number(budget.budgetId),
      },
      data: {
        ...budget,
        maximum:maximum
      },
    });
  
    if (!budgetUpdate) {
      return res.end("Budget to update not found");
    }
    return res.status(200).json({
      success: true,
      message: `${budgetUpdate.categoryId} budget updated`,
    });
  };