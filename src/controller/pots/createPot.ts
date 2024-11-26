import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient()

export const createPot: controller = async (req, res) => {
    const { target, name, total, theme } = req.body;
    //@ts-expect-error middleware
    const userId = req.user;
  
    const newPot = await prisma.pot.create({
      data: {
        target: Number(target),
        name: name,
        total: Number(total),
        theme: theme,
        userId: userId,
      },
    });
  
    if (!newPot.createdAt) {
      return res.end("Error: Pot wasn't created; please try again");
    }
  
    return res.status(200).json({ success: true, message: "Pot created" });
  };