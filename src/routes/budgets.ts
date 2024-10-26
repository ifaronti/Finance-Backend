import { Router } from "express";
import { getBudgets } from "../controller/budgets/getBudgets";
import { createbudget } from "../controller/budgets/createBudget";
import { updateBudget } from "../controller/budgets/updateBudget";
import { deleteBudget } from "../controller/budgets/deleteBudget";

const budgetsRouter = Router();

budgetsRouter
  .route("/budgets")
  .get(getBudgets)
  .post(createbudget)
  .patch(updateBudget)
  .delete(deleteBudget);

export default budgetsRouter;
