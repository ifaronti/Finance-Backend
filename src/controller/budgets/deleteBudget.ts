import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

export const deleteBudget: controller = async (req, res) => {
    const { budgetId } = req.query;
    //@ts-expect-error middleware
    const userId = req.user;
   
    await prisma.budget.delete({
      where: {
        budgetId: Number(budgetId),
        userId:userId,
      },
    });
    return res.status(200).json({ success: true, message: "Budget deleted" });
}
  
