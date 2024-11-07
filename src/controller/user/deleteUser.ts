import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient()

export const deleteUser: controller = async (req, res) => {
    //@ts-expect-error middleware
    const userId = Number(req.user)

    await prisma.budget.deleteMany({where:{userId:userId}})
    await prisma.pot.deleteMany({where:{userId:userId}})
    await prisma.transactions.deleteMany({where:{userId:userId}})
    await prisma.bills.deleteMany({where:{userId:userId}})
    await prisma.user.delete({where: {id:userId}})

   return res.end('User deleted')
}