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

export const createbudget: controller = async (req, res) => {
    const {categoryId, category, maximum, theme }: budget = req.body;
    //@ts-expect-error middleware
    const userId = req.user;
  
    const totalSpent = await prisma.transactions.aggregate({
      where: {
        userId: Number(userId),
        category: category,
        date: {
          gt:"2024-07-31T20:50:18Z"
        }
      },
      _sum: {
        amount:true
      }
    })
    
    const newBudget = await prisma.budget.create({
      data: {
        categoryId:categoryId,
        maximum: Number(maximum),
        theme: theme,
        spent: Number(totalSpent._sum.amount?.toString().replace('-','')),
        userId: userId,
        category: category, 
      },
    });
    if (!newBudget) {
      return res.end("An error has occured, Budget was not created");
    }
  
    return res.status(200).json({ success: true, message: "Budget created" });
  };