import { PrismaClient } from "@prisma/client";
import { controller } from "../auth/signup.controller";

const prisma = new PrismaClient();

export const getBudgets: controller = async (req, res) => {
  // @ts-expect-error middleware
  const userId = req.user
  
  const budgets = await prisma.$queryRaw`
      WITH cte_transactions AS (
        SELECT
            t.amount,
            t.date,
            t.avatar,
            t.name,
            t."categoryId",
            ROW_NUMBER() OVER (PARTITION BY t."categoryId" ORDER BY t.date DESC) as t_rows
        FROM transactions t
        WHERE t."userId" = ${userId}
      )
      SELECT
        bg.category,
        bg."categoryId",
        bg.maximum,
        bg.theme,
        bg."budgetId",
        (
            SELECT
              SUM(tn.amount)
            from transactions tn
            WHERE tn."userId" = ${userId} AND tn."categoryId" = bg."categoryId"
            AND EXTRACT(MONTH FROM tn.date) > 7 
            AND tn.amount::text LIKE '%-%'
        ) AS spent,
        (
          SELECT 
            json_agg(
                  json_build_object(
                    'name', tc.name,
                    'amount', tc.amount,
                    'date', tc.date,
                    'avatar', tc.avatar
                  )
            )

        ) AS transactions
    FROM budgets bg
    LEFT JOIN cte_transactions tc
    ON bg."categoryId" = tc."categoryId" AND tc.amount::text LIKE '%-%' AND tc.t_rows <=3
    WHERE bg."userId" = ${userId}
    GROUP BY bg."budgetId", bg.category, bg."categoryId", bg.maximum, bg.theme
  `;

  if (!budgets) {
    return res.end("No budgets found");
  }
  return res.status(200).json({ success: true, data:budgets});
};