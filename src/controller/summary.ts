import { PrismaClient } from "@prisma/client";
import { controller } from "./auth/signup.controller";

const prisma = new PrismaClient()

export const Summaries: controller = async (req, res) => {
    //@ts-expect-error middleware
    const userId  = req.user
    const today = new Date().getDay()
    const account_summary = await prisma.$queryRaw`
        WITH summary AS (
                SELECT
                    u.income,
                    u.expenses,
                    u.balance,
                    u.id as id,
                    (SELECT SUM(bi.amount) FROM bills bi WHERE bi."userId" = ${userId} AND bi.due_day <= ${today+1}) AS paid_bills,
                    (SELECT SUM(bi.amount) FROM bills bi WHERE bi."userId" = ${userId} AND bi.due_day - ${today+1}  > 7) AS upcoming_bills,
                    (SELECT SUM(bi.amount) FROM bills bi WHERE bi."userId" = ${userId} AND bi.due_day - ${today+1}  <= 7 AND bi.due_day > ${today+1}) AS due_soon,
                    (SELECT SUM(p.total) FROM pots p WHERE p."userId" = ${userId}) AS total_saved,
                    (SELECT SUM(b.maximum) FROM budgets b WHERE b."userId" = ${userId}) AS total_limits,
                    (SELECT SUM(b.spent) FROM budgets b WHERE b."userId" = ${userId}) AS total_spent
                FROM "user" u
                WHERE u.id = ${userId}
            ),
            rowed_budgets AS(
                SELECT
                    b.category,
                    b.spent,
                    b.maximum,
                    b.theme,
                    b."userId",
                    ROW_NUMBER() OVER (ORDER BY b."createdAt") AS b_rows
                FROM budgets b
                WHERE b."userId" = ${userId}
            ),
            rowed_transactions AS(
                SELECT
                    t.name,
                    t.date,
                    t.amount,
                    t.avatar,
                    ROW_NUMBER() OVER (ORDER BY t.date DESC) AS t_rows
                FROM transactions t 
                WHERE t."userId" = ${userId}
            ),
            rowed_pots AS(
                SELECT
                    p.name,
                    p.total,
                    p.theme,
                    ROW_NUMBER() OVER (ORDER BY p.name) as p_rows
                FROM pots p
                WHERE p."userId" = ${userId}
            )
        SELECT
            s.income,
            s.expenses,
            s.balance,
            s.total_saved,
            s.paid_bills,
            s.upcoming_bills,
            s.due_soon,
            s.total_spent,
            s.total_limits,
            (   SELECT json_agg(
                    json_build_object(
                        'category', b.category,
                        'theme', b.theme,
                        'spent', b.spent,
                        'maximum', b.maximum
                    )
                )
                FROM rowed_budgets b
            ) AS budgets,
            (   SELECT 
                    json_agg(
                        json_build_object(
                            'name', t.name,
                            'date', t.date,
                            'amount', t.amount,
                            'avatar', t.avatar
                        )
                    )
                FROM rowed_transactions t
                WHERE t.t_rows <=5
            ) AS transactions,
            (   SELECT
                    json_agg(
                        json_build_object(
                            'name', p.name,
                            'total', p.total,
                            'theme', p.theme
                        )
                    )
                FROM rowed_pots p
                WHERE p.p_rows <= 4
            ) AS pots
        FROM summary s
    `  
    //@ts-expect-error type definitions too long
    const data = account_summary[0]
    await prisma.$disconnect()

    return res.status(200).json({success:true, data:data})
}
