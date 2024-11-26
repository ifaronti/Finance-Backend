import express from "express";
import authRouter from "./routes/auth";
import summaryRouter from "./routes/summary";
import cors from "cors";
import { authChecker } from "./middlewares/auth";
import transactionsRouter from "./routes/transactions";
import budgetsRouter from "./routes/budgets";
import potRouter from "./routes/pots";
import billsRouter from "./routes/bills";
import userRouter from "./routes/user";
import { config } from "dotenv";
config()

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api", authRouter);
app.use("/api", authChecker, [
  summaryRouter,
  transactionsRouter,
  budgetsRouter,
  potRouter,
  billsRouter,
  userRouter
]);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

export default app