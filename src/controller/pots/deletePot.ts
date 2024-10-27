import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

export const deletepot: controller = async (req, res) => {
    const { potId } = req.query;
    //@ts-expect-error middleware
    const userId = Number(req.user);
  
    await prisma.pot.delete({
      where: {
        potId: Number(potId),
        userId: userId,
      },
    });
    return res.status(200).json({ success: true, message: "pot deleted" });
  };