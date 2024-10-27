import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";
import { CronJob } from "cron";

const prisma = new PrismaClient();

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