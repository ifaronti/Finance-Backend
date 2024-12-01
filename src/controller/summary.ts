import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/signup.controller";

const prisma = new PrismaClient()

export const Summaries: controller = async (req, res) => {
    //@ts-expect-error middleware
    const userId  = req.user

    const potsTotal = await prisma.pots.aggregate({
        where: { userId: userId },
        _sum: {
            total: true,
        },
    })

    const user = await prisma.user.findFirst({
        where: {
            id:userId
        },
        select: {
            expenses: true,
            balance: true,
            income: true,
            transactions: {
                select: {
                    name: true,
                    avatar: true,
                    amount: true,
                    date:true
                },
                orderBy: { date: 'desc' },
                take:5
            },
            pots: {
                select: {
                    name: true,
                    target: true,
                    theme: true,
                    total:true
                },
                take:4
            },
            budgets: {
                select: {
                    category: true,
                    maximum: true,
                    theme: true,
                    spent:true
                },
                take:4
            },
            bills: {
                select: {
                    name: true,
                    amount: true,
                    due_day:true
                }
            }
        }
    })    

    await prisma.$disconnect()
    const responseData = {
        accountSummary:{expenses:user?.expenses, balance:user?.balance, income:user?.income},
        transactionsSummary: user?.transactions,
        billsSummary: user?.bills,
        budgetSummary: {snippet:user?.budgets},
        potSummary: { totalSaved: potsTotal, summaryItems: user?.pots }
    }

    return res.status(200).json({success:true, data:responseData})
}
