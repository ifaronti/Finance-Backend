import { Router } from "express";
import {
  getBudgets,
  createbudget,
  updateBudget,
  deleteBudget,
} from "../controller/budget.controller";

const budgetsRouter = Router();

budgetsRouter
  .route("/budgets")
  .get(getBudgets)
  .post(createbudget)
  .patch(updateBudget)
  .delete(deleteBudget);

export default budgetsRouter;
