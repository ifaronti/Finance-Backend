import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/signup.controller";

const prisma = new PrismaClient()

export const Summaries: controller = async (req, res) => {
    const objectMonth = new Date().getMonth() + 1
    const presentMonth = objectMonth > 9? objectMonth:'0'+objectMonth
    const presentYear = new Date().getFullYear()
    //@ts-expect-error middleware
    const userId  = req.user
    
    const transactions = await prisma.transactions.findMany({
        where: {
            userId:userId
        },
        take:5
    })

    const bills = await prisma.bills.findMany({
        where: {
            userId: userId,
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

    const budgetAggregate = await prisma.budgets.aggregate({
        where: { userId: userId },
        _sum: {
            maximum: true,
            spent:true
        },
    })

    const budgetSnippet = await prisma.budgets.findMany({
        where: { userId: userId },
        select: {
            category: true,
            maximum: true,
            theme: true
        },
        take:4
    })

    const potsTotal = await prisma.pots.aggregate({
        where: { userId: userId },
        _sum: {
            total: true,
        },
    })

    const potSnippet = await prisma.pots.findMany({
        where: { userId: userId },
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
