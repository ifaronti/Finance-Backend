import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/auth.controller";

const prisma = new PrismaClient()

export const Summaries: controller = async (req, res) => {
    const objectMonth = new Date().getMonth() + 1
    const presentMonth = objectMonth > 9? objectMonth:'0'+objectMonth
    const presentYear = new Date().getFullYear()
    //@ts-expect-error middleware
    const userId  = req.user
    
    const transactions = await prisma.transactions.findMany({
        where: {
            userId:Number(userId)
        },
        take:5
    })

    const bills = await prisma.bills.findMany({
        where: {
            userId: Number(userId),
        },
    })

    const paidBills = await prisma.transactions.findMany({
        where: {
          recurring: true,
          date: {
            gte:`${presentYear}-${presentMonth}-01T00:00:00Z`
          }
        }
      })

    const budgetAggregate = await prisma.budget.aggregate({
        where: { userId: Number(userId) },
        _sum: {
            maximum: true,
            spent:true
        },
    })

    const budgetSnippet = await prisma.budget.findMany({
        where: { userId: Number(userId) },
        select: {
            category: true,
            maximum: true,
            theme: true
        },
        take:4
    })

    const potsTotal = await prisma.pot.aggregate({
        where: { userId: Number(userId) },
        _sum: {
            total: true,
        },
    })

    const potSnippet = await prisma.pot.findMany({
        where: { userId: Number(userId) },
        select: {
            theme: true,
            name: true,
            total:true
        },
        take:4
    })

    const user = await prisma.user.findFirst({
        where: {
            id:userId
        },
        select: {
            expenses: true,
            balance: true,
            income:true
        }
    })    

    await prisma.$disconnect()
    const responseData = {
        accountSummary:user,
        transactionsSummary: transactions,
        billsSummary: bills,
        paidBills:paidBills,
        budgetSummary: {summary:budgetAggregate, snippet:budgetSnippet},
        potSummary: { totalSaved: potsTotal, summaryItems: potSnippet }
    }

    return res.status(200).json({success:true, data:responseData})
}
