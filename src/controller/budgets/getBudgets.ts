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
      SUM(CASE WHEN EXTRACT(MONTH FROM t.date) > 7 THEN t.amount ELSE 0 END) AS spent,  -- Only sum amounts after July
      bg.theme, 
      json_agg(t.transaction ORDER BY t.transaction->>'date' DESC) AS transactions
    FROM 
      budgets bg
    LEFT JOIN LATERAL (
      SELECT 
          json_build_object('name', t.name, 'amount', t.amount, 'date', t.date, 'avatar', t.avatar) AS transaction, 
          t.amount,
          t."userId", 
          t.date  -- Include the raw t.date and t.amount in the lateral join for outer query use
      FROM transactions t
      WHERE t."categoryId" = bg."categoryId"
      ORDER BY t.date DESC
      LIMIT 3
    ) AS t ON true
    WHERE bg."userId" = ${userId} AND t."userId" = ${userId}
    GROUP BY bg."budgetId"`;

  if (!budgets) {
    return res.end("No budgets found");
  }
  
  return res.status(200).json({ success: true, data:budgets});
};