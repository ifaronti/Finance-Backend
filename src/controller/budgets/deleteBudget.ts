import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/auth.controller";

const prisma = new PrismaClient();

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
  
