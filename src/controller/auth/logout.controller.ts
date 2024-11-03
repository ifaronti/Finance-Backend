import { controller } from "./signup.controller";
import { PrismaClient } from "@prisma/client";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient()
const jwt = jsonwebtoken

export const Logout: controller = async (req, res) => {
    const { authorization } = req.headers
    const token = authorization?.split(' ')[1]
    //@ts-expect-error jwt payload
    const payload:JwtPayload = jwt.verify(String(token), String(process.env.JWT_ASHIRI))

    const usedTokens = await prisma.user.findFirst({
        where: { id: Number(payload.userId) },
        select: {
            usedTokens:true
        }
    })
    const alTokens = [...usedTokens?.usedTokens as string[]]

    await prisma.user.update({
        where: { id: Number(payload.userId) },
        data: {
            usedTokens: {
                set:[...alTokens, String(token) ]
            }
        }
    })

    res.send('user successfully logged out')
};