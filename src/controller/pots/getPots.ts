import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

type skip = {
  skip?: number;
};

export const getPots: controller = async (req, res) => {
  const { skip }: skip = req.query;
  //@ts-expect-error middleware
  const userId = req.user;
  const pots = await prisma.pots.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: "asc" },
    skip: Number(skip),
    take: 10,
  });

  const names = await prisma.pots.findMany({
    where: { userId: userId },
    select: {
      name: true,
    },
  });

  if (!pots) {
    return res.end("No pots found");
  }

  return res.status(200).json({ success: true, data: pots, names: names });
};