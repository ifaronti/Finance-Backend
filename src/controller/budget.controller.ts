import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/auth.controller";

const prisma = new PrismaClient();

type getBudgetsBody = {
  userId?: number;
  skip?: number;
};

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

export const getBudgets: controller = async (req, res) => {
  const { skip }: getBudgetsBody = req.body;
  // @ts-expect-error middleware
  const userId = Number(req.user)
  
  const budgets = await prisma.budget.findMany({
    where: {
      userId: userId,
    },
    take: 10,
    skip:skip,
    include: {
      category_relate: {
        select: {
          transactions: {
            select: {
              name: true,
              date: true,
              amount: true,
              avatar:true
            },
            orderBy:{date:'desc'},
            take:3
          }
        }
      },
    },
  });

  if (!budgets) {
    return res.end("No budgets found");
  }

  const chartItems = await prisma.budget.findMany({
    where: { userId: userId },
    select: {
      spent: true,
      maximum: true,
      theme: true,
      category:true
    }
  })
  return res.status(200).json({ success: true, data:budgets, chartItems:chartItems});
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

export const deleteBudget: controller = async (req, res) => {
  const { budgetId } = req.query;
  //@ts-expect-error middleware
  const userId = req.user;
 
  await prisma.budget.delete({
    where: {
      budgetId: Number(budgetId),
      userId: Number(userId),
    },
  });
  return res.status(200).json({ success: true, message: "Budget deleted" });
}