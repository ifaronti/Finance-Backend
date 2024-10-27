import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";
import { sortResponse } from "../../support/sort";

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