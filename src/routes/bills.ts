import { Router } from "express";
import { deleteBill } from "../controller/bills/deleteBill";
import { createBills } from "../controller/bills/createBill";
import { getBills } from "../controller/bills/getBills";

const billsRouter = Router();

billsRouter.route("/bills").get(getBills).post(createBills).delete(deleteBill);

export default billsRouter
