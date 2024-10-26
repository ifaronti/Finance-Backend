import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/auth.controller";
import { CronJob } from "cron";
import { sortResponse } from "../support/sort";

const prisma = new PrismaClient();
type query = {
  name?: { contains: string; mode: "insensitive" };
  userId: number;
};

export const getBills: controller = async (req, res) => {
  const { skip, name, sort } = req.query;
  //@ts-expect-error authentication middleware
  const query: query = { userId: Number(req.user) };

  if (name && name !== undefined && name !== null && name !== "") {
    query.name = { contains: name?.toString(), mode: "insensitive" };
  }
  const order = sortResponse(String(sort), "createdAt");
  const objectMonth = new Date().getMonth() + 1
  const presentMonth = objectMonth > 9? objectMonth:'0'+objectMonth
  const presentYear = new Date().getFullYear()

  const bills = await prisma.bills.findMany({
    where: { ...query },
    skip: Number(skip),
    take: 10,
    orderBy: order,
  });

  const paidBills = await prisma.transactions.findMany({
    where: {
      recurring: true,
      date: {
        gte:`${presentYear}-${presentMonth}-01T00:00:00Z`
      }
    }
  })

  if (!bills[0]) {
    return res.end("No bills available for user");
  }
  const isLastPage = bills.length < 10 ? true : false;

  return res.status(200).json({ success: true, data: bills, isLastPage, paidBills });
};

export const createBills: controller = async (req, res) => {
  const { amount, name, avatar, category, categoryId } = req.body;
  //@ts-expect-error authentication middleware
  const userId = req.user;
  const dayOfMonth = Number(new Date().getDate());

  const newBill = await prisma.bills.create({
    data: { amount, name, avatar, category, categoryId, userId: userId },
  });

  if (!newBill.BillId) {
    return res.end("An error occured, please try again");
  }

  const balanceUpdateJob = CronJob.from({
    cronTime: `0 0 ${dayOfMonth - 1} * *`,
    onTick: async function () {
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });

      await prisma.transactions.create({
        data: {
          amount,
          name,
          avatar,
          category,
          categoryId,
          recurring: true,
          userId: userId,
          date: new Date(),
        },
      });
    },
    start: true,
    timeZone: "Europe/London",
  });
  balanceUpdateJob.start();

  return res.end("Bill created");
};

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
