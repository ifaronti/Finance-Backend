import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

type getBudgetsBody = {
  userId?: number;
  skip?: number;
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