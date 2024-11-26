import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient()

type updateQuery = {
    increment?: number;
    decrement?: number;
};
  
type thePot = {
    potId: number;
    theme: string;
    target: number;
    total: number;
    name: string;
  };

export const updatePot: controller = async (req, res) => {
    const { name, target, total, theme, potId }: thePot = req.body;
    const { add, subtract } = req.query;
    //@ts-expect-error middleware
    const userId = req.user;
    const query: updateQuery = {};
  
    if (add && add !== "") {
      query.increment = Number(add);
    }
    if (subtract && subtract !== "") {
      query.decrement = Number(subtract);
    }
  
  if (subtract || add) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        balance: query,
      },
    });
  }
  
    const potUpdate = await prisma.pots.update({
      where: {
        userId: userId,
        potId: potId,
      },
      data: {
        target: Number(target),
        name,
        total,
        potId,
        theme,
      },
    });
  
    if (!potUpdate) {
      return res.end("pot to update not found");
    }
    return res.status(200).json({
      success: true,
      message: `${potUpdate.name} pot updated`,
    });
  };