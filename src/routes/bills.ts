import { Router } from "express";
import {
  getBills,
  createBills,
  deleteBill,
} from "../controller/bills.controller";

const billsRouter = Router();

billsRouter.route("/bills").get(getBills).post(createBills).delete(deleteBill);

export default billsRouter
