import express from "express";
import router from "./routes/auth";
import summaryRouter from "./routes/summary";
import cors from "cors";
import { authChecker } from "./middlewares/auth";
import transactionsRouter from "./routes/transactions";
import budgetsRouter from "./routes/budgets";
import potRouter from "./routes/pots";
import billsRouter from "./routes/bills";

const authRoute = router;

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", authRoute);
app.use("/api", authChecker, [
  summaryRouter,
  transactionsRouter,
  budgetsRouter,
  potRouter,
  billsRouter,
]);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
