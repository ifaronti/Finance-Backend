import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient()

export const deleteBill: controller = async (req, res) => {
    const { id } = req.query;
    //@ts-expect-error auth middleware added request.user to the request object for security
    const userId = req.user;
  
    await prisma.bills.delete({
      where: {
        userId: userId,
        BillId: Number(id),
      },
    });
  
    return res
      .status(200)
      .json({ success: true, message: "Bill deleted succeefully" });
  };
  