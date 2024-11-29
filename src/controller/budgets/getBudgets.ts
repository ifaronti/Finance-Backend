import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

export const getBudgets: controller = async (req, res) => {
  // @ts-expect-error middleware
  const userId = req.user
  
  const budgets = await prisma.$queryRaw`
    SELECT 
        bg."budgetId", 
        bg.maximum, 
        bg.category, 
        bg."isPlaceholder",
        bg."categoryId", 
        SUM(t.amount) AS spent,
        bg.theme, 
        json_agg(t.transaction) AS transactions 
    FROM budgets bg
    LEFT JOIN LATERAL (
        SELECT 
            json_build_object('name', t.name, 'amount', t.amount, 'date', t.date, 'avatar', t.avatar) AS transaction,
            t.amount  -- Keep the amount in the subquery to use for SUM in the outer query Not knowing this cost me stress
        FROM transactions t
        WHERE t."categoryId" = bg."categoryId"
        AND EXTRACT(MONTH FROM t.date) > 7  
        LIMIT 3  
    ) AS t
    ON true  -- LATERAL join, no explicit ON condition needed
    WHERE bg."userId" = ${userId}
    GROUP BY bg."budgetId"`;

  if (!budgets) {
    return res.end("No budgets found");
  }
  return res.status(200).json({ success: true, data:budgets});
};