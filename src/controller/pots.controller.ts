import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/auth.controller";

const prisma = new PrismaClient();

type skip = {
  skip?: number;
};

type thePot = {
  potId: number;
  theme: string;
  target: number;
  total: number;
  name: string;
};

type updateQuery = {
  increment?: number;
  decrement?: number;
};

export const getPots: controller = async (req, res) => {
  const { skip }: skip = req.query;
  //@ts-expect-error middleware
  const userId = Number(req.user);
  const pots = await prisma.pot.findMany({
    where: {
      userId: userId,
    },
    orderBy: { createdAt: "asc" },
    skip: Number(skip),
    take: 10,
  });

  const names = await prisma.pot.findMany({
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

export const updatePot: controller = async (req, res) => {
  const { name, target, total, theme, potId }: thePot = req.body;
  const { add, subtract } = req.query;
  //@ts-expect-error middleware
  const userId = Number(req.user);
  const query: updateQuery = {};

  if (add && add != "") {
    query.increment = Number(add);
  }
  if (subtract && subtract !== "") {
    query.decrement = Number(subtract);
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      balance: query,
    },
  });

  const potUpdate = await prisma.pot.update({
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

export const createPot: controller = async (req, res) => {
  const { target, name, total, theme } = req.body;
  //@ts-expect-error middleware
  const userId = Number(req.user);

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
