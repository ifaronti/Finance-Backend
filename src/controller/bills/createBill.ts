import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";
import { CronJob } from "cron";

const prisma = new PrismaClient();

export const createBills: controller = async (req, res) => {
  const { amount, name, avatar, category, categoryId } = req.body;
  //@ts-expect-error authentication middleware
  const userId = req.user;
  const dayOfMonth = Number(new Date().getDate());
  const formattedDay = Number(dayOfMonth) < 10? '0'+dayOfMonth:dayOfMonth

  const newBill = await prisma.bills.create({
    data: { amount, name, avatar, category, categoryId, userId: userId },
  });

  if (!newBill.billId) {
    return res.end("An error occured, please try again");
  }

  const balanceUpdateJob = CronJob.from({
    cronTime: `0 0 ${Number(formattedDay)} * *`,
    onTick: async function () {
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } },
      });

      await prisma.transactions.create({
        data: { amount, name, avatar, category, categoryId, recurring: true, userId }
      })
    },
    start: false,
    timeZone: "Europe/London",
  });
  const checkBill = await prisma.bills.findFirst({ where: { billId: newBill.billId } })
  
  if (!checkBill?.billId) {
    balanceUpdateJob.stop()
  }
  if (checkBill?.billId) {
    balanceUpdateJob.start()
  }
  
  return res.end("Bill created");
};